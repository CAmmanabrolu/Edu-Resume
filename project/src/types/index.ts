export type UserRole = 'student' | 'employer' | 'issuer';

export interface User {
  address: string;
  role: UserRole;
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  issuedTo: string;
  issuedAt: number;
  tokenId: string;
  metadata: {
    description: string;
    skills: string[];
    validUntil?: number;
  };
  status: 'pending' | 'verified' | 'rejected';
}

export interface VerificationRequest {
  id: string;
  credentialId: string;
  requestedBy: string;
  requestedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  stakedAmount: string;
}