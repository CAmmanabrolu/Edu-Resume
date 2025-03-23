import React from 'react';
import { GraduationCap, Shield, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const { connect, isConnecting } = useAuthStore();

  return (
    <div className="space-y-20 -mt-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
              Verifiable<br />credentials<br />
              <span className="text-blue-500">on EDU Chain</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Build your blockchain-verified resume with educational
              credentials that can never be falsified. Share proofs while
              maintaining privacy with zero-knowledge technology.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                size="lg"
                onClick={connect}
                isLoading={isConnecting}
              >
                Connect Wallet
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                asChild
              >
                <Link to="/credentials">Verify Credentials</Link>
              </Button>
            </div>
          </div>
          <div className="bg-blue-400 h-[500px] rounded-xl hidden md:block"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <div className="text-center mb-10">
          <h2 className="text-blue-500 uppercase text-sm font-semibold tracking-wider mb-2">Features</h2>
          <h3 className="text-4xl font-bold mb-4">A better way to verify education</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            EduResume provides a trustless, transparent platform for educational
            credentials verification.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 absolute -top-6 left-6">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 mt-6">Blockchain-Verified Credentials</h3>
            <p className="text-gray-600">
              Educational credentials secured and verified on the blockchain.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 absolute -top-6 left-6">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 mt-6">Zero-Knowledge Proofs</h3>
            <p className="text-gray-600">
              Share credential proofs without revealing sensitive information.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md relative">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 absolute -top-6 left-6">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2 mt-6">EDU Token Rewards</h3>
            <p className="text-gray-600">
              Earn tokens for verifications and stake to participate in governance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};