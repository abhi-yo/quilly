import { ethers } from 'ethers';

export const POLYGON_AMOY_CONFIG = {
  chainId: '0x13882',
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

export const CONTRACT_ADDRESSES = {
  QUILLY_TOKEN: process.env.NEXT_PUBLIC_QUILLY_TOKEN_ADDRESS || '',
  COPYRIGHT_PROTECTION: process.env.NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS || '',
  DAO_GOVERNANCE: process.env.NEXT_PUBLIC_DAO_GOVERNANCE_ADDRESS || '',
};

// Demo mode when contracts aren't deployed
const DEMO_MODE = !CONTRACT_ADDRESSES.QUILLY_TOKEN || !CONTRACT_ADDRESSES.COPYRIGHT_PROTECTION;

export const QUILLY_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function claimFaucet() external",
  "function tipWriter(address writer, uint256 amount, string articleId) external",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "event Tip(address indexed from, address indexed to, uint256 amount, string articleId)",
  "event FaucetClaim(address indexed user, uint256 amount)"
];

export const COPYRIGHT_PROTECTION_ABI = [
  "function registerContent(string contentHash, string title, string ipfsHash) payable returns (bytes32)",
  "function verifyContentOwnership(string contentHash) view returns (bool exists, address author, uint256 timestamp, string title)",
  "function checkForPlagiarism(string suspectedContentHash, address suspectedAuthor) returns (bool isPlagiarism)",
  "function getAuthorContent(address author) view returns (bytes32[])",
  "function getContentRecord(bytes32 recordId) view returns (tuple(address author, string contentHash, uint256 timestamp, string title, string ipfsHash, bool isActive))",
  "function registrationFee() view returns (uint256)",
  "function generateContentHash(string content) pure returns (string)",
  "event ContentRegistered(bytes32 indexed recordId, address indexed author, string contentHash, string title, uint256 timestamp)",
  "event PlagiarismDetected(bytes32 indexed originalRecordId, address indexed originalAuthor, address indexed suspectedPlagiarist, string suspectedContentHash)"
];

export const DAO_GOVERNANCE_ABI = [
  "function createProposal(string title, string description, string category) external returns (uint256)",
  "function vote(uint256 proposalId, bool support) external",
  "function executeProposal(uint256 proposalId) external",
  "function getProposal(uint256 proposalId) view returns (tuple(uint256 id, address proposer, string title, string description, string category, uint256 forVotes, uint256 againstVotes, uint256 startTime, uint256 endTime, bool executed))",
  "function hasVoted(uint256 proposalId, address voter) view returns (bool)",
  "function getVote(uint256 proposalId, address voter) view returns (bool)",
  "function getActiveProposals() view returns (uint256[])",
  "function getProposalResult(uint256 proposalId) view returns (bool isPassed, uint256 totalVotes, uint256 participationRate)",
  "function proposalCount() view returns (uint256)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, string category, uint256 endTime)",
  "event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId, bool passed)"
];

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async connectWallet(): Promise<string | null> {
    if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      
      // Try to switch to Polygon Amoy, but don't fail if it doesn't work
      try {
        await this.switchToPolygonAmoy();
      } catch (networkError) {
        console.warn('Failed to switch to Polygon Amoy:', networkError);
        // Continue with whatever network the user is currently on
      }
      
      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchToPolygonAmoy(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_AMOY_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_AMOY_CONFIG],
          });
        } catch (addError) {
          throw new Error('Failed to add Polygon Amoy network');
        }
      } else {
        throw switchError;
      }
    }
  }

  async getQuillyTokenContract(): Promise<ethers.Contract> {
    if (!this.signer) throw new Error('Wallet not connected');
    return new ethers.Contract(CONTRACT_ADDRESSES.QUILLY_TOKEN, QUILLY_TOKEN_ABI, this.signer);
  }

  async getCopyrightProtectionContract(): Promise<ethers.Contract> {
    if (!this.signer) throw new Error('Wallet not connected');
    return new ethers.Contract(CONTRACT_ADDRESSES.COPYRIGHT_PROTECTION, COPYRIGHT_PROTECTION_ABI, this.signer);
  }

  async getDAOGovernanceContract(): Promise<ethers.Contract> {
    if (!this.signer) throw new Error('Wallet not connected');
    return new ethers.Contract(CONTRACT_ADDRESSES.DAO_GOVERNANCE, DAO_GOVERNANCE_ABI, this.signer);
  }

  async getTokenBalance(address: string): Promise<string> {
    if (DEMO_MODE) {
      // Return demo balance
      return "0";
    }
    const contract = await this.getQuillyTokenContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async claimFaucet(): Promise<string> {
    if (DEMO_MODE) {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      return "0x" + Math.random().toString(16).substr(2, 40);
    }
    const contract = await this.getQuillyTokenContract();
    const tx = await contract.claimFaucet();
    return tx.hash;
  }

  async tipWriter(writerAddress: string, amount: string, articleId: string): Promise<string> {
    const contract = await this.getQuillyTokenContract();
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.tipWriter(writerAddress, amountWei, articleId);
    return tx.hash;
  }

  async registerContent(contentHash: string, title: string, ipfsHash: string): Promise<string> {
    if (DEMO_MODE) {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      return "0x" + Math.random().toString(16).substr(2, 40);
    }
    const contract = await this.getCopyrightProtectionContract();
    const fee = await contract.registrationFee();
    const tx = await contract.registerContent(contentHash, title, ipfsHash, { value: fee });
    return tx.hash;
  }

  async verifyContentOwnership(contentHash: string): Promise<{
    exists: boolean;
    author: string;
    timestamp: number;
    title: string;
  }> {
    if (DEMO_MODE) {
      // Simulate verification check
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        exists: false,
        author: "0x0000000000000000000000000000000000000000",
        timestamp: 0,
        title: ""
      };
    }
    const contract = await this.getCopyrightProtectionContract();
    const result = await contract.verifyContentOwnership(contentHash);
    return {
      exists: result[0],
      author: result[1],
      timestamp: Number(result[2]),
      title: result[3],
    };
  }

  async checkForPlagiarism(contentHash: string, authorAddress: string): Promise<boolean> {
    const contract = await this.getCopyrightProtectionContract();
    const tx = await contract.checkForPlagiarism(contentHash, authorAddress);
    const receipt = await tx.wait();
    
    const event = receipt.logs.find((log: any) => 
      log.fragment && log.fragment.name === 'PlagiarismDetected'
    );
    
    return !!event;
  }

  async createProposal(title: string, description: string, category: string): Promise<string> {
    const contract = await this.getDAOGovernanceContract();
    const tx = await contract.createProposal(title, description, category);
    return tx.hash;
  }

  async voteOnProposal(proposalId: number, support: boolean): Promise<string> {
    const contract = await this.getDAOGovernanceContract();
    const tx = await contract.vote(proposalId, support);
    return tx.hash;
  }

  async getActiveProposals(): Promise<number[]> {
    const contract = await this.getDAOGovernanceContract();
    const proposalIds = await contract.getActiveProposals();
    return proposalIds.map((id: bigint) => Number(id));
  }

  async getProposal(proposalId: number): Promise<{
    id: number;
    proposer: string;
    title: string;
    description: string;
    category: string;
    forVotes: string;
    againstVotes: string;
    startTime: number;
    endTime: number;
    executed: boolean;
  }> {
    const contract = await this.getDAOGovernanceContract();
    const result = await contract.getProposal(proposalId);
    
    return {
      id: Number(result[0]),
      proposer: result[1],
      title: result[2],
      description: result[3],
      category: result[4],
      forVotes: ethers.formatEther(result[5]),
      againstVotes: ethers.formatEther(result[6]),
      startTime: Number(result[7]),
      endTime: Number(result[8]),
      executed: result[9],
    };
  }

  generateContentHash(content: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(content));
  }

  isConnected(): boolean {
    return this.signer !== null;
  }

  async getCurrentAccount(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }
}

export const web3Service = new Web3Service();

declare global {
  interface Window {
    ethereum?: any;
  }
} 