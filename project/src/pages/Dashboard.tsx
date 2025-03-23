import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, CheckCircle, Clock, ExternalLink, FileCheck, Briefcase, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { useCredentials } from '../hooks/useCredentials';
import { formatRelativeTime } from '../lib/utils';
import { Credential, VerificationRequest } from '../types';

// Mock data for verification requests
const mockVerificationRequests: VerificationRequest[] = [
  {
    id: '1',
    credentialId: '2',
    requestedBy: '0x1234...5678',
    requestedAt: Date.now() - 86400000 * 2, // 2 days ago
    status: 'pending',
    stakedAmount: '10000000000000000', // 0.01 ETH
  },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { data: credentials = [], isLoading: isLoadingCredentials } = useCredentials();

  const { data: pendingRequests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['verification-requests', 'pending', user?.address],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockVerificationRequests.filter(req => req.status === 'pending');
    },
    enabled: !!user,
  });

  if (!user) {
    return null;
  }

  const verifiedCount = credentials.filter(cred => cred.status === 'verified').length;
  const pendingCount = credentials.filter(cred => cred.status === 'pending').length;

  const getWelcomeMessage = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedSection = () => {
    switch (user.role) {
      case 'student':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Career Passport</CardTitle>
                <CardDescription>
                  Showcase your verified credentials to potential employers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <Award className="mx-auto h-6 w-6 text-blue-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">{credentials.length}</h3>
                    <p className="text-sm text-gray-500">Total Credentials</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">{verifiedCount}</h3>
                    <p className="text-sm text-gray-500">Verified</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <Clock className="mx-auto h-6 w-6 text-yellow-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">{pendingCount}</h3>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <Briefcase className="mx-auto h-6 w-6 text-purple-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">0</h3>
                    <p className="text-sm text-gray-500">Job Applications</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link 
                  to="/credentials"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View all credentials
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
            
            {pendingCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Verifications</CardTitle>
                  <CardDescription>
                    Credentials awaiting verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {credentials
                      .filter(c => c.status === 'pending')
                      .slice(0, 3)
                      .map(credential => (
                        <li key={credential.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{credential.title}</h4>
                            <p className="text-xs text-gray-500">
                              Issued by {credential.issuer}
                            </p>
                          </div>
                          <div className="flex items-center text-xs text-yellow-500">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>Pending</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link 
                    to="/verification-requests"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Manage verification requests
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>EDU Chain</CardTitle>
                <CardDescription>
                  Your blockchain activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Wallet Address</span>
                    <a 
                      href={`https://eduscan.io/address/${user.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      {user.address.slice(0, 8)}...{user.address.slice(-6)}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                  
                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-gray-500">EDU Balance</span>
                    <span className="text-sm font-medium">0.00 EDU</span>
                  </div>
                  
                  <div className="mt-3 flex justify-between">
                    <span className="text-sm text-gray-500">Credentials</span>
                    <span className="text-sm font-medium">{credentials.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'issuer':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Credential Issuance Dashboard</CardTitle>
                <CardDescription>
                  Manage the credentials you've issued to students and professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <Award className="mx-auto h-6 w-6 text-blue-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">0</h3>
                    <p className="text-sm text-gray-500">Credentials Issued</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">0</h3>
                    <p className="text-sm text-gray-500">Verified</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <FileCheck className="mx-auto h-6 w-6 text-yellow-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">{pendingRequests.length}</h3>
                    <p className="text-sm text-gray-500">Verification Requests</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link 
                  to="/issue-credentials"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Issue new credential
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
            
            {pendingRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Verification Requests</CardTitle>
                  <CardDescription>
                    Review and process verification requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pendingRequests.slice(0, 3).map(request => (
                      <li key={request.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Credential #{request.credentialId}</h4>
                          <p className="text-xs text-gray-500">
                            Requested {formatRelativeTime(request.requestedAt)}
                          </p>
                        </div>
                        <Link to="/verification-requests">
                          <Button 
                            className="h-8 px-3 text-xs bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Review
                          </Button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link 
                    to="/verification-requests"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View all requests
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Issuer Status</CardTitle>
                <CardDescription>
                  Your standing as a credential issuer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Verified Issuer</span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Reputation Score</p>
                      <p className="font-medium">100%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Blockchain Address</p>
                      <a 
                        href={`https://eduscan.io/address/${user.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:underline"
                      >
                        View
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'employer':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Employer Dashboard</CardTitle>
                <CardDescription>
                  Verify and review candidate credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <Briefcase className="mx-auto h-6 w-6 text-blue-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">0</h3>
                    <p className="text-sm text-gray-500">Job Listings</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">0</h3>
                    <p className="text-sm text-gray-500">Verified Credentials</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                    <FileCheck className="mx-auto h-6 w-6 text-yellow-500" />
                    <h3 className="mt-2 text-2xl font-semibold text-gray-900">{pendingRequests.length}</h3>
                    <p className="text-sm text-gray-500">Verification Requests</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Post New Job
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common employer tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to="/verification-requests">
                    <Button 
                      className="w-full justify-start bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                    >
                      <FileCheck className="mr-2 h-4 w-4 text-blue-600" />
                      Review Verification Requests
                    </Button>
                  </Link>
                  <Button 
                    className="w-full justify-start bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                  >
                    <Briefcase className="mr-2 h-4 w-4 text-blue-600" />
                    Manage Job Listings
                  </Button>
                  <Button 
                    className="w-full justify-start bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                  >
                    <Award className="mr-2 h-4 w-4 text-blue-600" />
                    Verify a Credential
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  Your identity on EDU Chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Verified Company</span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Blockchain Address</p>
                      <a 
                        href={`https://eduscan.io/address/${user.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:underline"
                      >
                        View
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">EDU Balance</p>
                      <p className="font-medium">5.00 EDU</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-600">{getWelcomeMessage()}</h3>
        <h1 className="text-2xl font-bold text-gray-900">
          {user.profile.name || `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`}
        </h1>
      </div>

      {getRoleBasedSection()}
    </div>
  );
};