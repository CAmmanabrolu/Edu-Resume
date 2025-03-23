import React from 'react';
import { Wallet, LogOut, ChevronDown, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { shortenAddress } from '../../lib/utils';

interface WalletConnectProps {
  className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ className }) => {
  const { user, connect, disconnect, isConnecting } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return (
      <Button
        onClick={connect}
        leftIcon={<Wallet className="h-4 w-4" />}
        isLoading={isConnecting}
        className={`${className} bg-blue-600 hover:bg-blue-700`}
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className={`${className} border-blue-300 text-blue-600 hover:bg-blue-50`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        rightIcon={<ChevronDown className="h-4 w-4" />}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {shortenAddress(user.address)}
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white py-2 shadow-lg z-50">
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-gray-500">Connected as</p>
            <p className="truncate text-sm font-medium text-gray-900">
              {shortenAddress(user.address, 10)}
            </p>
          </div>
          
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleCopyAddress}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            
            <a
              href={`https://eduscan.io/address/${user.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on EDU Chain
            </a>
            
            <button
              onClick={disconnect}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 