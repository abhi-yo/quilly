// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IQuillyToken {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

contract DAOGovernance {
    IQuillyToken public quillyToken;
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        string category;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTING_POWER = 100 * 10**18;
    uint256 public constant PROPOSAL_THRESHOLD = 1000 * 10**18;
    
    enum ProposalCategory {
        FEATURE_REQUEST,
        POLICY_CHANGE,
        TOKEN_ECONOMICS,
        PLATFORM_UPGRADE,
        COMMUNITY_INITIATIVE
    }
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string category,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    
    modifier onlyTokenHolder() {
        require(quillyToken.balanceOf(msg.sender) >= MIN_VOTING_POWER, "Insufficient voting power");
        _;
    }
    
    modifier validProposal(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        _;
    }
    
    constructor(address _quillyToken) {
        quillyToken = IQuillyToken(_quillyToken);
    }
    
    function createProposal(
        string calldata title,
        string calldata description,
        string calldata category
    ) external onlyTokenHolder returns (uint256) {
        require(quillyToken.balanceOf(msg.sender) >= PROPOSAL_THRESHOLD, "Insufficient tokens to propose");
        require(bytes(title).length > 0 && bytes(title).length <= 100, "Invalid title length");
        require(bytes(description).length > 0 && bytes(description).length <= 1000, "Invalid description length");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.category = category;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, title, category, newProposal.endTime);
        
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external validProposal(proposalId) onlyTokenHolder {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 votingPower = quillyToken.balanceOf(msg.sender);
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteChoice[msg.sender] = support;
        
        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support, votingPower);
    }
    
    function executeProposal(uint256 proposalId) external validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        
        bool passed = proposal.forVotes > proposal.againstVotes && 
                     proposal.forVotes > (quillyToken.totalSupply() / 10);
        
        emit ProposalExecuted(proposalId, passed);
    }
    
    function getProposal(uint256 proposalId) external view validProposal(proposalId) returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        string memory category,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.category,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }
    
    function hasVoted(uint256 proposalId, address voter) external view validProposal(proposalId) returns (bool) {
        return proposals[proposalId].hasVoted[voter];
    }
    
    function getVote(uint256 proposalId, address voter) external view validProposal(proposalId) returns (bool) {
        require(proposals[proposalId].hasVoted[voter], "User has not voted");
        return proposals[proposalId].voteChoice[voter];
    }
    
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](proposalCount);
        uint256 activeCount = 0;
        
        for (uint256 i = 1; i <= proposalCount; i++) {
            if (block.timestamp <= proposals[i].endTime && !proposals[i].executed) {
                activeIds[activeCount] = i;
                activeCount++;
            }
        }
        
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeIds[i];
        }
        
        return result;
    }
    
    function getProposalResult(uint256 proposalId) external view validProposal(proposalId) returns (
        bool isPassed,
        uint256 totalVotes,
        uint256 participationRate
    ) {
        Proposal storage proposal = proposals[proposalId];
        uint256 total = proposal.forVotes + proposal.againstVotes;
        uint256 totalSupply = quillyToken.totalSupply();
        
        bool passed = proposal.forVotes > proposal.againstVotes && 
                     proposal.forVotes > (totalSupply / 10);
        
        return (passed, total, (total * 100) / totalSupply);
    }
} 