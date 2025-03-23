import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Layers, Award, FileCheck, Coins } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { WalletConnect } from '../wallet/WalletConnect';
import { cn } from '../../lib/utils';

export const Header = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = React.useMemo(() => {
    // Public navigation for all users (including non-authenticated)
    const items = [
      { name: 'Home', href: '/', icon: <Layers className="h-4 w-4" /> },
      { name: 'Credentials', href: '/credentials', icon: <Award className="h-4 w-4" /> },
      { name: 'Verify', href: '/verify', icon: <FileCheck className="h-4 w-4" /> },
      { name: 'Staking', href: '/staking', icon: <Coins className="h-4 w-4" /> },
    ];

    // Add authenticated-only routes
    if (user) {
      if (user.role === 'issuer') {
        items.push({
          name: 'Issue Credentials',
          href: '/issue-credentials',
          icon: <Award className="h-4 w-4" />,
        });
      }
      
      // Add dashboard link only for authenticated users
      items.push({
        name: 'Dashboard',
        href: '/dashboard',
        icon: <Layers className="h-4 w-4" />,
      });
    }

    return items;
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">EduResume</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href || 
                  (item.href === '/verify' && location.pathname === '/verification-requests')
                    ? 'text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-700 hover:text-gray-900'
                )}
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button and wallet connect */}
          <div className="flex items-center gap-4">
            <WalletConnect className="hidden md:flex" />
            
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'absolute inset-x-0 top-16 z-10 origin-top-right transform transition md:hidden',
          mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0 pointer-events-none'
        )}
      >
        <div className="border-b border-gray-200 bg-white px-2 py-3 shadow-lg">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium',
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
                onClick={closeMobileMenu}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <WalletConnect className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};