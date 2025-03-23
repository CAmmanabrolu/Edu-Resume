import React from 'react';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

interface WalletConnectProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  size = 'md',
  variant = 'default'
}) => {
  const { user, isConnecting, connect, disconnect } = useAuthStore();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };
  
  // Format address for display: 0x1234...5678
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {user?.isConnected ? (
        <div className="flex gap-2 items-center">
          <div className="hidden md:flex px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-md border border-green-200">
            {formatAddress(user.address)}
          </div>
          <Button
            size={size}
            variant="outline"
            onClick={handleDisconnect}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          size={size}
          variant={variant}
          onClick={handleConnect}
          isLoading={isConnecting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}; 