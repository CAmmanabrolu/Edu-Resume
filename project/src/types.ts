// Define user roles for the application
export type UserRole = 'student' | 'employer' | 'issuer';

// User interface representing authenticated users
export interface User {
  address: string; // Wallet address
  name?: string;
  email?: string;
  role: UserRole;
  isConnected: boolean;
}

// Credential status types
export type CredentialStatus = 'pending' | 'verified' | 'rejected';

// Credential interface for representing educational credentials
export interface Credential {
  id: string;
  tokenId: string;
  title: string;
  issuer: string;
  issuedTo: string;
  issuedAt: number; // timestamp
  status: CredentialStatus;
  metadata: {
    description?: string;
    skills?: string[];
    [key: string]: any; // Additional metadata fields
  };
}

// Staking interface
export interface StakingInfo {
  amount: string;
  startTime: number;
  endTime?: number;
  rewards: string;
}

// Verification request interface
export interface VerificationRequest {
  id: string;
  credentialId: string;
  requestedBy: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
} 