import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { CoinsIcon, TrendingUpIcon, WalletIcon, TimerIcon } from 'lucide-react';
import { getTokenBalance, stakeTokens, unstakeTokens, getStakedBalance, getRewards, claimRewards, useMockBlockchain } from '../lib/blockchain';

export const Staking: React.FC = () => {
  const { user } = useAuthStore();
  const [balance, setBalance] = useState('0');
  const [stakedBalance, setStakedBalance] = useState('0');
  const [rewards, setRewards] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const loadBalances = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        if (!useMockBlockchain) {
          // Get balances from blockchain
          const tokenBal = await getTokenBalance(user.address);
          const stakedBal = await getStakedBalance(user.address);
          const rewardsAmount = await getRewards(user.address);
          
          setBalance(tokenBal);
          setStakedBalance(stakedBal);
          setRewards(rewardsAmount);
        } else {
          // Mock data for development
          await new Promise(resolve => setTimeout(resolve, 1000));
          setBalance('1000');
          setStakedBalance('500');
          setRewards('25');
        }
      } catch (error) {
        console.error('Error loading balances:', error);
        toast.error('Failed to load token balances');
      } finally {
        setIsLoading(false);
      }
    };

    loadBalances();
    
    // Refresh balances every 30 seconds
    const intervalId = setInterval(loadBalances, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid amount to stake');
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(balance)) {
      toast.error('Insufficient balance');
      return;
    }

    setIsStaking(true);
    try {
      if (!useMockBlockchain) {
        // Stake tokens on blockchain
        await stakeTokens(stakeAmount);
        
        // Update balances after staking
        const newBalance = await getTokenBalance(user!.address);
        const newStakedBalance = await getStakedBalance(user!.address);
        
        setBalance(newBalance);
        setStakedBalance(newStakedBalance);
      } else {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update balances
        setBalance(prev => (parseFloat(prev) - parseFloat(stakeAmount)).toString());
        setStakedBalance(prev => (parseFloat(prev) + parseFloat(stakeAmount)).toString());
      }
      
      toast.success(`Successfully staked ${stakeAmount} EDU tokens`);
      setStakeAmount('');
    } catch (error) {
      console.error('Error staking tokens:', error);
      toast.error('Failed to stake tokens');
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error('Please enter a valid amount to unstake');
      return;
    }

    if (parseFloat(unstakeAmount) > parseFloat(stakedBalance)) {
      toast.error('Insufficient staked balance');
      return;
    }

    setIsUnstaking(true);
    try {
      if (!useMockBlockchain) {
        // Unstake tokens on blockchain
        await unstakeTokens(unstakeAmount);
        
        // Update balances after unstaking
        const newBalance = await getTokenBalance(user!.address);
        const newStakedBalance = await getStakedBalance(user!.address);
        
        setBalance(newBalance);
        setStakedBalance(newStakedBalance);
      } else {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update balances
        setBalance(prev => (parseFloat(prev) + parseFloat(unstakeAmount)).toString());
        setStakedBalance(prev => (parseFloat(prev) - parseFloat(unstakeAmount)).toString());
      }
      
      toast.success(`Successfully unstaked ${unstakeAmount} EDU tokens`);
      setUnstakeAmount('');
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      toast.error('Failed to unstake tokens');
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (parseFloat(rewards) <= 0) {
      toast.error('No rewards to claim');
      return;
    }

    setIsClaiming(true);
    try {
      if (!useMockBlockchain) {
        // Claim rewards on blockchain
        await claimRewards();
        
        // Update balances after claiming
        const newBalance = await getTokenBalance(user!.address);
        const newRewards = await getRewards(user!.address);
        
        setBalance(newBalance);
        setRewards(newRewards);
      } else {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update balances
        setBalance(prev => (parseFloat(prev) + parseFloat(rewards)).toString());
        setRewards('0');
      }
      
      toast.success(`Successfully claimed ${rewards} EDU tokens`);
    } catch (error) {
      console.error('Error claiming rewards:', error);
      toast.error('Failed to claim rewards');
    } finally {
      setIsClaiming(false);
    }
  };

  const handleMaxStake = () => {
    setStakeAmount(balance);
  };

  const handleMaxUnstake = () => {
    setUnstakeAmount(stakedBalance);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Token Staking</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-700">Available Balance</p>
                {isLoading ? (
                  <div className="h-7 w-20 bg-blue-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-blue-900">{parseFloat(balance).toLocaleString()} EDU</h3>
                )}
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <WalletIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-700">Staked Balance</p>
                {isLoading ? (
                  <div className="h-7 w-20 bg-green-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-green-900">{parseFloat(stakedBalance).toLocaleString()} EDU</h3>
                )}
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CoinsIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-yellow-700">Pending Rewards</p>
                {isLoading ? (
                  <div className="h-7 w-20 bg-yellow-100 animate-pulse rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-yellow-900">{parseFloat(rewards).toLocaleString()} EDU</h3>
                )}
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <TrendingUpIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Stake Tokens</h2>
            <p className="text-sm text-gray-500">Stake your EDU tokens to earn rewards</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Stake
                </label>
                <div className="flex">
                  <Input
                    id="stakeAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    disabled={isStaking || !user}
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={handleMaxStake}
                    disabled={isStaking || !user}
                  >
                    MAX
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 flex items-center">
                <TimerIcon className="h-4 w-4 mr-1" />
                <span>Staking period: 30 days minimum</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button
              onClick={handleStake}
              disabled={isStaking || !user || !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > parseFloat(balance)}
              isLoading={isStaking}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isStaking ? "Staking..." : "Stake EDU"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Unstake Tokens</h2>
            <p className="text-sm text-gray-500">Withdraw your staked EDU tokens</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="unstakeAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount to Unstake
                </label>
                <div className="flex">
                  <Input
                    id="unstakeAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    disabled={isUnstaking || !user}
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-l-none border-l-0"
                    onClick={handleMaxUnstake}
                    disabled={isUnstaking || !user}
                  >
                    MAX
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Note: Unstaking before the minimum staking period may result in reduced rewards.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={handleClaimRewards}
              disabled={isClaiming || !user || parseFloat(rewards) <= 0}
              isLoading={isClaiming}
            >
              {isClaiming ? "Claiming..." : "Claim Rewards"}
            </Button>
            
            <Button
              onClick={handleUnstake}
              disabled={isUnstaking || !user || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > parseFloat(stakedBalance)}
              isLoading={isUnstaking}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isUnstaking ? "Unstaking..." : "Unstake EDU"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Staking Information</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">APY</h3>
                <p className="text-2xl font-bold text-blue-600">12%</p>
                <p className="text-sm text-gray-500 mt-1">Annual Percentage Yield</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">Total Staked</h3>
                <p className="text-2xl font-bold text-blue-600">1.5M EDU</p>
                <p className="text-sm text-gray-500 mt-1">Across all stakers</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-1">Rewards Distribution</h3>
                <p className="text-2xl font-bold text-blue-600">Daily</p>
                <p className="text-sm text-gray-500 mt-1">Rewards are calculated daily</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">How Staking Works</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Stake your EDU tokens to participate in the network and earn rewards.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Rewards are calculated based on your staked amount and the current APY.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>You can claim your rewards at any time, but unstaking before the minimum period may incur penalties.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                  <span>Longer staking periods may qualify for bonus rewards and higher APY rates.</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 