import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { toast } from 'sonner';
import { initBlockchain, checkNetwork, useMockBlockchain } from '../lib/blockchain';

interface AuthState {
  user: User | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  setRole: (role: UserRole) => void;
  updateProfile: (profile: { name?: string; email?: string }) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Mock wallet address for development when no MetaMask is available
const MOCK_WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isConnecting: false,
      connect: async () => {
        set({ isConnecting: true });
        try {
          let address;
          
          // First try MetaMask/browser wallet
          if (window.ethereum) {
            try {
              // Request accounts access
              const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
              });

              if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please unlock your MetaMask wallet.');
              }
              
              address = accounts[0];
              console.log('Connected to wallet with address:', address);
              
              // Initialize blockchain (can be async, don't await)
              initBlockchain().catch(error => {
                console.warn('Non-critical: Blockchain initialization failed:', error);
              });
              
              // Subscribe to wallet events (account changes, disconnects)
              window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                  // User disconnected their wallet
                  set({ user: null });
                  toast.info('Wallet disconnected');
                } else {
                  // User switched accounts
                  set((state) => ({
                    user: state.user ? { ...state.user, address: accounts[0] } : null,
                  }));
                  toast.info('Account changed to ' + accounts[0].substring(0, 6) + '...');
                }
              });
              
              // Handle chain changes
              window.ethereum.on('chainChanged', () => {
                toast.info('Network changed, refreshing...');
                // Reload the page when the user switches chains
                setTimeout(() => window.location.reload(), 1500);
              });
              
              toast.success('Wallet connected successfully!');
            } catch (error) {
              console.error('MetaMask connection error:', error);
              
              // If MetaMask request fails but we're in development mode, fallback to mock
              if (process.env.NODE_ENV === 'development' || useMockBlockchain) {
                console.warn('Falling back to mock wallet for development');
                address = MOCK_WALLET_ADDRESS;
                toast.warning('Using demo wallet (MetaMask error)', {
                  duration: 5000,
                });
              } else {
                throw error; // Re-throw for production
              }
            }
          } else {
            // No ethereum object - use mock wallet if in development
            if (process.env.NODE_ENV === 'development' || useMockBlockchain) {
              console.warn('No wallet detected. Using mock wallet for development');
              address = MOCK_WALLET_ADDRESS;
              
              toast.warning('Using demo wallet (No wallet detected)', {
                duration: 5000,
              });
            } else {
              throw new Error('No Ethereum wallet detected. Please install MetaMask.');
            }
          }

          // Set the user state with the wallet address
          if (address) {
            set({
              user: {
                address,
                name: '',
                email: '',
                role: 'student',
                isConnected: true
              },
              isConnecting: false,
            });
          } else {
            throw new Error('Failed to get wallet address');
          }
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to connect wallet');
          set({ isConnecting: false });
        }
      },
      disconnect: () => {
        set({ user: null });
        toast.success('Wallet disconnected');
      },
      setRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null,
        }));
        toast.success(`Role updated to ${role}`);
      },
      updateProfile: (profile) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...profile,
              }
            : null,
        }));
        toast.success('Profile updated successfully');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);