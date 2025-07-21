import { ethers } from "ethers";

export const POLYGON_AMOY_CONFIG = {
  chainId: "0x13882",
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-amoy.polygon.technology/"],
  blockExplorerUrls: ["https://amoy.polygonscan.com/"],
};

export const LOCAL_CONFIG = {
  rpcUrl: process.env.LOCAL_RPC_URL || "http://127.0.0.1:8545",
  chainId: "0x7A69", // Hardhat local chain ID (31337 in hex)
};

export const CONTRACT_ADDRESSES = {
  QUILLY_TOKEN: process.env.NEXT_PUBLIC_QUILLY_TOKEN_ADDRESS || "",
  COPYRIGHT_PROTECTION:
    process.env.NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS || "",
  DAO_GOVERNANCE: process.env.NEXT_PUBLIC_DAO_GOVERNANCE_ADDRESS || "",
};

// Demo mode when contracts aren't deployed
const DEMO_MODE =
  !CONTRACT_ADDRESSES.QUILLY_TOKEN || !CONTRACT_ADDRESSES.COPYRIGHT_PROTECTION;

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
  "event FaucetClaim(address indexed user, uint256 amount)",
];

export const COPYRIGHT_PROTECTION_ABI = [
  "function registerContent(string contentHash, string title, string ipfsHash) payable returns (bytes32)",
  "function verifyContentOwnership(string contentHash) view returns (bool exists, address author, uint256 timestamp, string title, uint256 blockNumber)",
  "function checkForPlagiarism(string suspectedContentHash, address suspectedAuthor) returns (bool isPlagiarism)",
  "function getAuthorContent(address author) view returns (bytes32[])",
  "function getContentRecord(bytes32 recordId) view returns (tuple(address author, string contentHash, uint256 timestamp, string title, string ipfsHash, bool isActive, uint256 blockNumber))",
  "function registrationFee() view returns (uint256)",
  "function generateContentHash(string content) pure returns (string)",
  "function bulkVerifyContent(string[] contentHashes) view returns (bool[] exists, address[] authors)",
  "function getContractStats() view returns (uint256 totalRecords, uint256 currentFee, bool isPaused, address contractOwner)",
  "function deactivateContent(bytes32 recordId) external",
  "function reactivateContent(bytes32 recordId) external",
  "function paused() view returns (bool)",
  "event ContentRegistered(bytes32 indexed recordId, address indexed author, string contentHash, string title, uint256 timestamp, uint256 blockNumber)",
  "event PlagiarismDetected(bytes32 indexed originalRecordId, address indexed originalAuthor, address indexed suspectedPlagiarist, string suspectedContentHash, uint256 timestamp)",
  "event ContentDeactivated(bytes32 indexed recordId, address indexed author, uint256 timestamp)",
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
  "event ProposalExecuted(uint256 indexed proposalId, bool passed)",
];

export interface CopyrightVerificationResult {
  exists: boolean;
  author: string;
  timestamp: number;
  title: string;
  blockNumber?: number;
}

export interface ContractStats {
  totalRecords: number;
  currentFee: string;
  isPaused: boolean;
  contractOwner: string;
}

export class Web3Service {
  private provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null =
    null;
  private signer: ethers.JsonRpcSigner | null = null;

  async connectWallet(): Promise<string | null> {
    if (typeof window === "undefined") throw new Error("No window");
    const rpcUrl = process.env.LOCAL_RPC_URL
      ? LOCAL_CONFIG.rpcUrl
      : POLYGON_AMOY_CONFIG.rpcUrls[0];
    if (process.env.LOCAL_RPC_URL) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.signer = await this.provider.getSigner();
    } else {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await (this.provider as ethers.BrowserProvider).getSigner();
    }
    if (!this.signer) throw new Error("No signer");
    const address = await this.signer.getAddress();
    return address;
  }

  async getQuillyTokenContract(): Promise<ethers.Contract> {
    if (!this.signer) throw new Error("Wallet not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.QUILLY_TOKEN,
      QUILLY_TOKEN_ABI,
      this.signer
    );
  }

  async getCopyrightProtectionContract(): Promise<ethers.Contract> {
    if (!this.signer) throw new Error("Wallet not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.COPYRIGHT_PROTECTION,
      COPYRIGHT_PROTECTION_ABI,
      this.signer
    );
  }

  async getDAOGovernanceContract(): Promise<ethers.Contract> {
    if (!this.signer) throw new Error("Wallet not connected");
    return new ethers.Contract(
      CONTRACT_ADDRESSES.DAO_GOVERNANCE,
      DAO_GOVERNANCE_ABI,
      this.signer
    );
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return "0x" + Math.random().toString(16).substr(2, 40);
    }
    const contract = await this.getQuillyTokenContract();
    const tx = await contract.claimFaucet();
    return tx.hash;
  }

  async tipWriter(
    writerAddress: string,
    amount: string,
    articleId: string
  ): Promise<string> {
    const contract = await this.getQuillyTokenContract();
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.tipWriter(writerAddress, amountWei, articleId);
    return tx.hash;
  }

  async registerContent(
    contentHash: string,
    title: string,
    ipfsHash: string = ""
  ): Promise<string> {
    if (DEMO_MODE) {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return "0x" + Math.random().toString(16).substr(2, 40);
    }

    try {
      const contract = await this.getCopyrightProtectionContract();

      // Skip pause check if it fails
      try {
        const isPaused = await contract.paused();
        if (isPaused) {
          throw new Error("Copyright registration is currently paused");
        }
      } catch (error) {
        // Continue if pause check fails
      }

      // Try to get registration fee, fallback to default if it fails
      let fee;
      try {
        fee = await contract.registrationFee();
      } catch (error) {
        fee = ethers.parseEther("0.001"); // Default fee of 0.001 MATIC
      }

      // Get current gas price
      const feeData = await this.provider!.getFeeData();
      const gasPrice = feeData.gasPrice || ethers.parseUnits("30", "gwei");

      // Set a reasonable default gas limit for content registration
      const defaultGasLimit = BigInt(500000); // 500k gas units should be enough
      let gasLimit;

      try {
        // Try to estimate gas
        const gasEstimate = await contract.registerContent.estimateGas(
          contentHash,
          title,
          ipfsHash,
          { value: fee }
        );
        gasLimit = (gasEstimate * BigInt(150)) / BigInt(100); // 50% buffer
      } catch (error) {
        gasLimit = defaultGasLimit;
      }

      // Send transaction with our gas parameters
      const tx = await contract.registerContent(contentHash, title, ipfsHash, {
        value: fee,
        gasLimit,
        gasPrice: gasPrice || ethers.parseUnits("50", "gwei"), // Higher default gas price
      });

      return tx.hash;
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific Polygon Amoy testnet issues
      if (
        error.code === "INSUFFICIENT_FUNDS" ||
        error.message?.includes("insufficient funds")
      ) {
        throw new Error(
          "Insufficient MATIC to pay for gas. Please get more MATIC from the faucet."
        );
      } else if (
        error.code === "UNPREDICTABLE_GAS_LIMIT" ||
        error.message?.includes("gas")
      ) {
        throw new Error(
          "Gas estimation failed. Please try again in a few moments."
        );
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("network")
      ) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      } else if (error.reason?.includes("already registered")) {
        throw new Error("This content has already been registered");
      } else if (error.reason?.includes("Insufficient")) {
        throw new Error("Insufficient payment for registration fee");
      } else if (error.reason?.includes("Empty")) {
        throw new Error("Content hash and title cannot be empty");
      } else if (error.reason?.includes("too long")) {
        throw new Error("Title or content hash is too long");
      } else {
        throw new Error(error.reason || "Failed to register copyright");
      }
    }
  }

  async verifyContentOwnership(
    contentHash: string
  ): Promise<CopyrightVerificationResult> {
    if (DEMO_MODE) {
      // Simulate verification check
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return {
        exists: true,
        author: "0xDemoAuthor",
        timestamp: Math.floor(Date.now() / 1000),
        title: "Demo Title",
        blockNumber: 123456,
      };
    }

    try {
      const contract = await this.getCopyrightProtectionContract();
      const result = await contract.verifyContentOwnership(contentHash);

      return {
        exists: result[0],
        author: result[1],
        timestamp: Number(result[2]),
        title: result[3],
        blockNumber: Number(result[4]),
      };
    } catch (error: any) {
      if (process.env.NODE_ENV === "production") {
        console.error("Verification error:", error);
      }
      throw new Error("Failed to verify content ownership");
    }
  }

  async bulkVerifyContent(contentHashes: string[]): Promise<{
    exists: boolean[];
    authors: string[];
  }> {
    if (DEMO_MODE) {
      return {
        exists: new Array(contentHashes.length).fill(false),
        authors: new Array(contentHashes.length).fill(
          "0x0000000000000000000000000000000000000000"
        ),
      };
    }

    const contract = await this.getCopyrightProtectionContract();
    const result = await contract.bulkVerifyContent(contentHashes);

    return {
      exists: result[0],
      authors: result[1],
    };
  }

  async checkForPlagiarism(
    contentHash: string,
    authorAddress: string
  ): Promise<boolean> {
    if (DEMO_MODE) {
      return false;
    }

    const contract = await this.getCopyrightProtectionContract();
    const tx = await contract.checkForPlagiarism(contentHash, authorAddress);
    const receipt = await tx.wait();

    const event = receipt.logs.find(
      (log: any) => log.fragment && log.fragment.name === "PlagiarismDetected"
    );

    return !!event;
  }

  async getContractStats(): Promise<ContractStats> {
    if (DEMO_MODE) {
      return {
        totalRecords: 0,
        currentFee: "0.001",
        isPaused: false,
        contractOwner: "0x0000000000000000000000000000000000000000",
      };
    }

    const contract = await this.getCopyrightProtectionContract();
    const result = await contract.getContractStats();

    return {
      totalRecords: Number(result[0]),
      currentFee: ethers.formatEther(result[1]),
      isPaused: result[2],
      contractOwner: result[3],
    };
  }

  async getUserContentRecords(address: string): Promise<string[]> {
    if (DEMO_MODE) {
      return [];
    }

    const contract = await this.getCopyrightProtectionContract();
    return await contract.getAuthorContent(address);
  }

  async createProposal(
    title: string,
    description: string,
    category: string
  ): Promise<string> {
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
