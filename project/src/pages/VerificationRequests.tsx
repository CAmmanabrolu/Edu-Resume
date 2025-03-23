import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Award, Calendar, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Credential } from '../types';
import { verifyCredential, useMockBlockchain } from '../lib/blockchain';

export const VerificationRequests: React.FC = () => {
  const { user } = useAuthStore();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch pending verification requests from the blockchain
    // For now, we'll use mock data
    const mockCredentials: Credential[] = [
      {
        id: '1',
        title: 'Bachelor of Science in Computer Science',
        issuer: 'University of Technology',
        issuedTo: '0x1234567890123456789012345678901234567890',
        issuedAt: new Date('2023-05-15').getTime(),
        tokenId: '1',
        metadata: {
          description: 'Completed Bachelor degree in Computer Science with honors',
          skills: ['Programming', 'Algorithms', 'Data Structures'],
        },
        status: 'pending',
      },
      {
        id: '2',
        title: 'Web Development Certification',
        issuer: 'CodeAcademy',
        issuedTo: '0x2345678901234567890123456789012345678901',
        issuedAt: new Date('2023-08-10').getTime(),
        tokenId: '2',
        metadata: {
          description: 'Advanced web development certification',
          skills: ['React', 'Node.js', 'TypeScript'],
        },
        status: 'pending',
      },
    ];
    
    setCredentials(mockCredentials);
    setFilteredCredentials(mockCredentials);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCredentials(credentials);
    } else {
      const filtered = credentials.filter(
        credential =>
          credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          credential.issuer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCredentials(filtered);
    }
  }, [searchQuery, credentials]);

  const handleVerify = async (credentialId: string, approved: boolean) => {
    setIsVerifying(true);
    
    try {
      if (!useMockBlockchain) {
        // Call blockchain utility to verify credential
        await verifyCredential(credentialId, approved);
      } else {
        // Mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update the credentials list
      setCredentials(prevCredentials =>
        prevCredentials.map(cred =>
          cred.id === credentialId
            ? { ...cred, status: approved ? 'verified' : 'rejected' }
            : cred
        )
      );
      
      // Close modal if open
      if (isModalOpen && selectedCredential?.id === credentialId) {
        setIsModalOpen(false);
        setSelectedCredential(null);
      }
      
      toast.success(
        approved
          ? 'Credential successfully verified!'
          : 'Credential has been rejected'
      );
    } catch (error) {
      console.error('Error verifying credential:', error);
      toast.error('Failed to update credential status');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleViewDetails = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  // Show a warning if the user is not an employer
  if (user && user.role !== 'employer') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
        </div>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <XCircle className="h-5 w-5 text-yellow-600" />
              <p>
                You need to be registered as an employer to verify credentials. 
                Please update your role in the profile settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search credentials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCredentials.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-10">
          <div className="rounded-full bg-blue-50 p-3 mb-4">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No pending verification requests</h3>
          <p className="text-gray-500 text-center max-w-md mb-4">
            There are no credentials pending verification at this time.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCredentials.map((credential) => (
            <Card key={credential.id} className="h-full">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">{credential.title}</h3>
                  <p className="text-sm text-gray-500">{credential.issuer}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-2">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="mr-2 h-4 w-4" />
                  Issued on: {new Date(credential.issuedAt).toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {credential.metadata.description || 'No description available'}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Issued to: {shortenAddress(credential.issuedTo)}
                  </p>
                </div>
                {credential.metadata.skills && credential.metadata.skills.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {credential.metadata.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {credential.metadata.skills.length > 3 && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                          +{credential.metadata.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(credential)}
                >
                  View Details
                </Button>
                <div className="flex gap-2">
                  {credential.status === 'pending' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        onClick={() => handleVerify(credential.id, false)}
                        disabled={isVerifying}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        onClick={() => handleVerify(credential.id, true)}
                        disabled={isVerifying}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Verify
                      </Button>
                    </>
                  ) : (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      credential.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {credential.status === 'verified' ? 'Verified' : 'Rejected'}
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedCredential && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCredential.title}
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Issuer</h4>
              <p>{selectedCredential.issuer}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
              <p className="text-sm text-gray-700">
                {selectedCredential.metadata.description || 'No description available'}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Issued To</h4>
              <p className="flex items-center text-sm">
                {selectedCredential.issuedTo}
                <a
                  href={`https://etherscan.io/address/${selectedCredential.issuedTo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Issued On</h4>
              <p>{new Date(selectedCredential.issuedAt).toLocaleDateString()}</p>
            </div>
            
            {selectedCredential.metadata.skills && selectedCredential.metadata.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCredential.metadata.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                selectedCredential.status === 'verified'
                  ? 'bg-green-100 text-green-800'
                  : selectedCredential.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedCredential.status === 'verified'
                  ? 'Verified'
                  : selectedCredential.status === 'rejected'
                  ? 'Rejected'
                  : 'Pending Verification'}
              </span>
            </div>
          </div>
          
          {selectedCredential.status === 'pending' && (
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => handleVerify(selectedCredential.id, false)}
                className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                disabled={isVerifying}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button
                onClick={() => handleVerify(selectedCredential.id, true)}
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={isVerifying}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Verify
              </Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

// Helper function to shorten address
function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}