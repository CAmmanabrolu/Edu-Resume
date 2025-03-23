import { ethers } from 'ethers';
import { toast } from 'sonner';

// Smart contract ABI (Application Binary Interface)
const EDU_TOKEN_ABI = [
  // ERC-20 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  
  // Custom functions for the EDU token
  "function stake(uint256 amount) returns (bool)",
  "function unstake(uint256 amount) returns (bool)",
  "function getStakedBalance(address owner) view returns (uint256)",
  "function getRewards(address owner) view returns (uint256)",
  "function claimRewards() returns (uint256)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Staked(address indexed user, uint256 amount, uint256 stakeId)"
];

const CREDENTIAL_NFT_ABI = [
  // ERC-721 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function tokensOf(address owner) view returns (uint256[])",
  
  // Custom functions for the Credential NFT
  "function issueCredential(address to, string memory uri) returns (uint256)",
  "function verifyCredential(uint256 tokenId, bool approved) returns (bool)",
  "function getCredentialData(uint256 tokenId) view returns (string memory)",
  
  // Events
  "event CredentialIssued(address indexed issuer, address indexed recipient, uint256 tokenId)",
  "event CredentialVerified(uint256 tokenId, address indexed verifier)"
];

// Contract addresses from environment variables or fallback to defaults
const EDU_TOKEN_ADDRESS = import.meta.env.VITE_EDU_TOKEN_ADDRESS || "0x4eDuT0k3nAddr3ss00000000000000000000000";
const CREDENTIAL_NFT_ADDRESS = import.meta.env.VITE_CREDENTIAL_NFT_ADDRESS || "0xCr3d3nt1alNFTAddr3ss000000000000000000";

// Network Chain ID from environment variable or fallback
const EDU_CHAIN_ID = import.meta.env.VITE_EDU_CHAIN_ID || '0x7a69'; // Default: 31337 (local dev chain)

// Provider & Signer setup
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;
let eduToken: ethers.Contract | null = null;
let credentialNFT: ethers.Contract | null = null;

// Interface for log object
interface EthersLog {
  topics: string[];
  data: string;
  [key: string]: unknown;
}

// Interface for credential metadata
export interface CredentialMetadata {
  title?: string;
  issuer?: string;
  description?: string;
  issuedAt?: number;
  expirationDate?: string;
  imageUrl?: string;
  skills?: string[];
  status?: string;
  [key: string]: unknown;
}

// Initialize the blockchain connection
export const initBlockchain = async (): Promise<boolean> => {
  try {
    if (window.ethereum) {
      // Modern dapp browsers
      provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      // Get the signer
      signer = await provider.getSigner();
      
      // Initialize contracts
      eduToken = new ethers.Contract(EDU_TOKEN_ADDRESS, EDU_TOKEN_ABI, signer);
      credentialNFT = new ethers.Contract(CREDENTIAL_NFT_ADDRESS, CREDENTIAL_NFT_ABI, signer);
      
      console.log("Blockchain connection initialized successfully");
      return true;
    } else {
      console.error("Ethereum provider not found. Please install MetaMask or another wallet.");
      toast.error("No Ethereum wallet detected. Please install MetaMask.");
      return false;
    }
  } catch (error) {
    console.error("Failed to initialize blockchain connection:", error);
    toast.error("Failed to connect to blockchain. Please try again.");
    return false;
  }
};

// Token functions
export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    if (!eduToken) await initBlockchain();
    const balance = await eduToken?.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Failed to get token balance:", error);
    return "0";
  }
};

export const getStakedBalance = async (address: string): Promise<string> => {
  try {
    if (!eduToken) await initBlockchain();
    const stakedBalance = await eduToken?.getStakedBalance(address);
    return ethers.formatEther(stakedBalance);
  } catch (error) {
    console.error("Failed to get staked balance:", error);
    return "0";
  }
};

export const getRewards = async (address: string): Promise<string> => {
  try {
    if (!eduToken) await initBlockchain();
    const rewards = await eduToken?.getRewards(address);
    return ethers.formatEther(rewards);
  } catch (error) {
    console.error("Failed to get rewards:", error);
    return "0";
  }
};

export const stakeTokens = async (amount: string): Promise<boolean> => {
  try {
    if (!eduToken) await initBlockchain();
    const amountInWei = ethers.parseEther(amount);
    const tx = await eduToken?.stake(amountInWei);
    await tx.wait();
    toast.success(`Successfully staked ${amount} EDU tokens`);
    return true;
  } catch (error) {
    console.error("Failed to stake tokens:", error);
    toast.error("Failed to stake tokens. Please try again.");
    return false;
  }
};

export const unstakeTokens = async (amount: string): Promise<boolean> => {
  try {
    if (!eduToken) await initBlockchain();
    const amountInWei = ethers.parseEther(amount);
    const tx = await eduToken?.unstake(amountInWei);
    await tx.wait();
    toast.success(`Successfully unstaked ${amount} EDU tokens`);
    return true;
  } catch (error) {
    console.error("Failed to unstake tokens:", error);
    toast.error("Failed to unstake tokens. Please try again.");
    return false;
  }
};

export const claimRewards = async (): Promise<boolean> => {
  try {
    if (!eduToken) await initBlockchain();
    const tx = await eduToken?.claimRewards();
    const receipt = await tx.wait();
    const rewardsAmount = ethers.formatEther(receipt.logs[0].data);
    toast.success(`Successfully claimed ${rewardsAmount} EDU tokens`);
    return true;
  } catch (error) {
    console.error("Failed to claim rewards:", error);
    toast.error("Failed to claim rewards. Please try again.");
    return false;
  }
};

// Credential functions
export const issueCredential = async (
  recipient: string, 
  metadata: {
    title: string;
    issuer: string;
    description: string;
    expirationDate?: string;
    imageUrl?: string;
    skills?: string[];
  }
): Promise<string | null> => {
  try {
    if (!credentialNFT) await initBlockchain();
    
    // Convert metadata to URI format (in production, this would be uploaded to IPFS)
    const metadataUri = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
    
    // Issue the credential
    const tx = await credentialNFT?.issueCredential(recipient, metadataUri);
    const receipt = await tx.wait();
    
    // Get tokenId from event logs
    const event = receipt.logs.find(
      (log: EthersLog) => log.topics[0] === ethers.id("CredentialIssued(address,address,uint256)")
    );
    
    if (event) {
      const tokenId = ethers.dataSlice(event.topics[3], 0, 32);
      toast.success(`Credential issued successfully with ID: ${tokenId}`);
      return tokenId;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to issue credential:", error);
    toast.error("Failed to issue credential. Please try again.");
    return null;
  }
};

export const verifyCredential = async (tokenId: string, approved: boolean): Promise<boolean> => {
  try {
    if (!credentialNFT) await initBlockchain();
    const tx = await credentialNFT?.verifyCredential(tokenId, approved);
    await tx.wait();
    toast.success(approved 
      ? `Credential verified successfully` 
      : `Credential rejected successfully`);
    return true;
  } catch (error) {
    console.error("Failed to update credential status:", error);
    toast.error("Failed to update credential status. Please try again.");
    return false;
  }
};

export const fetchUserCredentials = async (address: string): Promise<string[]> => {
  try {
    if (!credentialNFT) await initBlockchain();
    const tokenIds = await credentialNFT?.tokensOf(address);
    return tokenIds.map((id: ethers.BigNumberish) => id.toString());
  } catch (error) {
    console.error("Failed to fetch user credentials:", error);
    return [];
  }
};

export const getCredentialMetadata = async (tokenId: string): Promise<CredentialMetadata | null> => {
  try {
    if (!credentialNFT) await initBlockchain();
    const metadataUri = await credentialNFT?.getCredentialData(tokenId);
    
    // Parse the URI data
    if (metadataUri.startsWith('data:application/json;base64,')) {
      const base64Data = metadataUri.replace('data:application/json;base64,', '');
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString);
    }
    
    return null;
  } catch (error) {
    console.error("Failed to get credential metadata:", error);
    return null;
  }
};

// Helper function to check if connected to the correct network (EDU Chain)
export const checkNetwork = async (): Promise<boolean> => {
  try {
    if (!provider) await initBlockchain();
    const network = await provider?.getNetwork();
    
    // Use chain ID from environment variable or default
    if (network?.chainId.toString() !== EDU_CHAIN_ID) {
      toast.error("Please connect to EDU Chain network");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to check network:", error);
    return false;
  }
};

// Use mock mode based on environment variables or browser detection
export const useMockBlockchain = import.meta.env.VITE_ENABLE_MOCK === 'true' || !window.ethereum; 