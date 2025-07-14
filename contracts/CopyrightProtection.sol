// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CopyrightProtection is ReentrancyGuard, Pausable, Ownable {
    struct ContentRecord {
        address author;
        string contentHash;
        uint256 timestamp;
        string title;
        string ipfsHash;
        bool isActive;
        uint256 blockNumber;
    }
    
    mapping(bytes32 => ContentRecord) public contentRecords;
    mapping(address => bytes32[]) public authorContent;
    mapping(string => bytes32) public hashToRecordId;
    
    uint256 public recordCount;
    uint256 public registrationFee = 0.001 ether;
    uint256 public constant MAX_TITLE_LENGTH = 200;
    uint256 public constant MAX_HASH_LENGTH = 100;
    
    event ContentRegistered(
        bytes32 indexed recordId,
        address indexed author,
        string contentHash,
        string title,
        uint256 timestamp,
        uint256 blockNumber
    );
    
    event PlagiarismDetected(
        bytes32 indexed originalRecordId,
        address indexed originalAuthor,
        address indexed suspectedPlagiarist,
        string suspectedContentHash,
        uint256 timestamp
    );
    
    event RegistrationFeeUpdated(
        uint256 oldFee,
        uint256 newFee,
        uint256 timestamp
    );
    
    event ContentDeactivated(
        bytes32 indexed recordId,
        address indexed author,
        uint256 timestamp
    );
    
    modifier validContentHash(string calldata contentHash) {
        require(bytes(contentHash).length > 0, "Empty content hash");
        require(bytes(contentHash).length <= MAX_HASH_LENGTH, "Content hash too long");
        _;
    }
    
    modifier validTitle(string calldata title) {
        require(bytes(title).length > 0, "Empty title");
        require(bytes(title).length <= MAX_TITLE_LENGTH, "Title too long");
        _;
    }
    
    modifier notAlreadyRegistered(string calldata contentHash) {
        require(hashToRecordId[contentHash] == bytes32(0), "Content already registered");
        _;
    }
    
    modifier recordExists(bytes32 recordId) {
        require(contentRecords[recordId].author != address(0), "Record does not exist");
        _;
    }
    
    modifier onlyRecordOwner(bytes32 recordId) {
        require(contentRecords[recordId].author == msg.sender, "Not record owner");
        _;
    }

    constructor() Ownable(msg.sender) {
    }
    
    function registerContent(
        string calldata contentHash,
        string calldata title,
        string calldata ipfsHash
    ) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
        validContentHash(contentHash)
        validTitle(title)
        notAlreadyRegistered(contentHash)
        returns (bytes32) 
    {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        
        recordCount++;
        bytes32 recordId = keccak256(abi.encodePacked(
            msg.sender, 
            contentHash, 
            block.timestamp, 
            block.number,
            recordCount
        ));
        
        contentRecords[recordId] = ContentRecord({
            author: msg.sender,
            contentHash: contentHash,
            timestamp: block.timestamp,
            title: title,
            ipfsHash: ipfsHash,
            isActive: true,
            blockNumber: block.number
        });
        
        authorContent[msg.sender].push(recordId);
        hashToRecordId[contentHash] = recordId;
        
        emit ContentRegistered(
            recordId, 
            msg.sender, 
            contentHash, 
            title, 
            block.timestamp,
            block.number
        );
        
        return recordId;
    }
    
    function verifyContentOwnership(string calldata contentHash) 
        external 
        view 
        validContentHash(contentHash)
        returns (
            bool exists,
            address author,
            uint256 timestamp,
            string memory title,
            uint256 blockNumber
        ) 
    {
        bytes32 recordId = hashToRecordId[contentHash];
        
        if (recordId == bytes32(0)) {
            return (false, address(0), 0, "", 0);
        }
        
        ContentRecord memory record = contentRecords[recordId];
        
        if (!record.isActive) {
            return (false, address(0), 0, "", 0);
        }
        
        return (
            true, 
            record.author, 
            record.timestamp, 
            record.title,
            record.blockNumber
        );
    }
    
    function checkForPlagiarism(
        string calldata suspectedContentHash,
        address suspectedAuthor
    ) 
        external 
        validContentHash(suspectedContentHash)
        returns (bool isPlagiarism) 
    {
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
                suspectedContentHash,
                block.timestamp
            );
            return true;
        }
        
        return false;
    }
    
    function getAuthorContent(address author) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return authorContent[author];
    }
    
    function getContentRecord(bytes32 recordId) 
        external 
        view 
        recordExists(recordId)
        returns (ContentRecord memory) 
    {
        return contentRecords[recordId];
    }
    
    function deactivateContent(bytes32 recordId) 
        external 
        recordExists(recordId)
        onlyRecordOwner(recordId)
    {
        contentRecords[recordId].isActive = false;
        emit ContentDeactivated(recordId, msg.sender, block.timestamp);
    }
    
    function reactivateContent(bytes32 recordId) 
        external 
        recordExists(recordId)
        onlyRecordOwner(recordId)
    {
        contentRecords[recordId].isActive = true;
    }
    
    function updateRegistrationFee(uint256 newFee) 
        external 
        onlyOwner 
    {
        require(newFee <= 0.01 ether, "Fee too high");
        
        uint256 oldFee = registrationFee;
        registrationFee = newFee;
        
        emit RegistrationFeeUpdated(oldFee, newFee, block.timestamp);
    }
    
    function withdrawFees() 
        external 
        onlyOwner 
        nonReentrant 
    {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Fee withdrawal failed");
    }
    
    function emergencyWithdraw() 
        external 
        onlyOwner 
        whenPaused 
    {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Emergency withdrawal failed");
        }
    }
    
    function pause() 
        external 
        onlyOwner 
    {
        _pause();
    }
    
    function unpause() 
        external 
        onlyOwner 
    {
        _unpause();
    }
    
    function generateContentHash(string calldata content) 
        external 
        pure 
        returns (string memory) 
    {
        return string(abi.encodePacked(keccak256(abi.encodePacked(content))));
    }
    
    function bulkVerifyContent(string[] calldata contentHashes)
        external
        view
        returns (bool[] memory exists, address[] memory authors)
    {
        uint256 length = contentHashes.length;
        require(length <= 50, "Too many hashes to verify");
        
        exists = new bool[](length);
        authors = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            bytes32 recordId = hashToRecordId[contentHashes[i]];
            if (recordId != bytes32(0)) {
                ContentRecord memory record = contentRecords[recordId];
                exists[i] = record.isActive;
                authors[i] = record.author;
            }
        }
        
        return (exists, authors);
    }
    
    function getContractStats()
        external
        view
        returns (
            uint256 totalRecords,
            uint256 currentFee,
            bool isPaused,
            address contractOwner
        )
    {
        return (
            recordCount,
            registrationFee,
            paused(),
            owner()
        );
    }
    
    receive() external payable {
        revert("Direct payments not allowed");
    }
    
    fallback() external {
        revert("Function not found");
    }
} 