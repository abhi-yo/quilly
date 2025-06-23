// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CopyrightProtection {
    struct ContentRecord {
        address author;
        string contentHash;
        uint256 timestamp;
        string title;
        string ipfsHash;
        bool isActive;
    }
    
    mapping(bytes32 => ContentRecord) public contentRecords;
    mapping(address => bytes32[]) public authorContent;
    mapping(string => bytes32) public hashToRecordId;
    
    uint256 public recordCount;
    uint256 public registrationFee = 0.001 ether;
    address public owner;
    
    event ContentRegistered(
        bytes32 indexed recordId,
        address indexed author,
        string contentHash,
        string title,
        uint256 timestamp
    );
    
    event PlagiarismDetected(
        bytes32 indexed originalRecordId,
        address indexed originalAuthor,
        address indexed suspectedPlagiarist,
        string suspectedContentHash
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerContent(
        string calldata contentHash,
        string calldata title,
        string calldata ipfsHash
    ) external payable returns (bytes32) {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        require(bytes(contentHash).length > 0, "Content hash required");
        require(bytes(title).length > 0, "Title required");
        require(hashToRecordId[contentHash] == bytes32(0), "Content already registered");
        
        recordCount++;
        bytes32 recordId = keccak256(abi.encodePacked(msg.sender, contentHash, block.timestamp, recordCount));
        
        contentRecords[recordId] = ContentRecord({
            author: msg.sender,
            contentHash: contentHash,
            timestamp: block.timestamp,
            title: title,
            ipfsHash: ipfsHash,
            isActive: true
        });
        
        authorContent[msg.sender].push(recordId);
        hashToRecordId[contentHash] = recordId;
        
        emit ContentRegistered(recordId, msg.sender, contentHash, title, block.timestamp);
        
        return recordId;
    }
    
    function verifyContentOwnership(string calldata contentHash) external view returns (
        bool exists,
        address author,
        uint256 timestamp,
        string memory title
    ) {
        bytes32 recordId = hashToRecordId[contentHash];
        
        if (recordId == bytes32(0)) {
            return (false, address(0), 0, "");
        }
        
        ContentRecord memory record = contentRecords[recordId];
        return (record.isActive, record.author, record.timestamp, record.title);
    }
    
    function checkForPlagiarism(
        string calldata suspectedContentHash,
        address suspectedAuthor
    ) external returns (bool isPlagiarism) {
        bytes32 originalRecordId = hashToRecordId[suspectedContentHash];
        
        if (originalRecordId == bytes32(0)) {
            return false;
        }
        
        ContentRecord memory originalRecord = contentRecords[originalRecordId];
        
        if (originalRecord.author != suspectedAuthor && originalRecord.isActive) {
            emit PlagiarismDetected(
                originalRecordId,
                originalRecord.author,
                suspectedAuthor,
                suspectedContentHash
            );
            return true;
        }
        
        return false;
    }
    
    function getAuthorContent(address author) external view returns (bytes32[] memory) {
        return authorContent[author];
    }
    
    function getContentRecord(bytes32 recordId) external view returns (ContentRecord memory) {
        return contentRecords[recordId];
    }
    
    function updateRegistrationFee(uint256 newFee) external onlyOwner {
        registrationFee = newFee;
    }
    
    function withdrawFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    function deactivateContent(bytes32 recordId) external {
        require(contentRecords[recordId].author == msg.sender, "Not content owner");
        contentRecords[recordId].isActive = false;
    }
    
    function generateContentHash(string calldata content) external pure returns (string memory) {
        return string(abi.encodePacked(keccak256(abi.encodePacked(content))));
    }
} 