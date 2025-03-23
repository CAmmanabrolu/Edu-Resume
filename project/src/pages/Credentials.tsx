import React, { useState, useEffect } from 'react';
import { Award, Calendar, Search, Share2, Tag, Download, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { Credential } from '../types';
import { fetchUserCredentials, getCredentialMetadata, useMockBlockchain } from '../lib/blockchain';

export const Credentials: React.FC = () => {
  const { user } = useAuthStore();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const loadCredentials = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let userCredentials: Credential[] = [];
        
        if (!useMockBlockchain) {
          // Get credentials from blockchain
          const tokenIds = await fetchUserCredentials(user.address);
          
          // Fetch metadata for each credential
          const credentialsPromises = tokenIds.map(async (tokenId) => {
            const metadata = await getCredentialMetadata(tokenId);
            return {
              id: tokenId,
              title: metadata.title || 'Untitled Credential',
              issuer: metadata.issuer || 'Unknown Issuer',
              issuedTo: user.address,
              issuedAt: metadata.issuedAt || Date.now(),
              tokenId,
              metadata: {
                description: metadata.description || '',
                skills: metadata.skills || [],
              },
              status: metadata.status || 'verified',
            };
          });
          
          userCredentials = await Promise.all(credentialsPromises);
        } else {
          // Mock data for development
          userCredentials = [
            {
              id: '1',
              title: 'Bachelor of Science in Computer Science',
              issuer: 'University of Technology',
              issuedTo: user.address,
              issuedAt: new Date('2023-05-15').getTime(),
              tokenId: '1',
              metadata: {
                description: 'Completed Bachelor degree in Computer Science with honors',
                skills: ['Programming', 'Algorithms', 'Data Structures'],
              },
              status: 'verified',
            },
            {
              id: '2',
              title: 'Web Development Certification',
              issuer: 'CodeAcademy',
              issuedTo: user.address,
              issuedAt: new Date('2023-08-10').getTime(),
              tokenId: '2',
              metadata: {
                description: 'Advanced web development certification',
                skills: ['React', 'Node.js', 'TypeScript'],
              },
              status: 'verified',
            },
            {
              id: '3',
              title: 'Blockchain Fundamentals',
              issuer: 'Blockchain Institute',
              issuedTo: user.address,
              issuedAt: new Date('2023-10-05').getTime(),
              tokenId: '3',
              metadata: {
                description: 'Comprehensive introduction to blockchain technology and applications',
                skills: ['Blockchain', 'Cryptocurrency', 'Smart Contracts'],
              },
              status: 'verified',
            },
          ];
        }
        
        setCredentials(userCredentials);
        setFilteredCredentials(userCredentials);
      } catch (error) {
        console.error('Error loading credentials:', error);
        toast.error('Failed to load your credentials');
      } finally {
        setIsLoading(false);
      }
    };

    loadCredentials();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCredentials(credentials);
    } else {
      const filtered = credentials.filter(
        credential =>
          credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          credential.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (credential.metadata.skills && 
            credential.metadata.skills.some(skill => 
              skill.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
      setFilteredCredentials(filtered);
    }
  }, [searchQuery, credentials]);

  const handleViewDetails = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  const handleShare = (credential: Credential) => {
    setSelectedCredential(credential);
    // Create shareable URL with credential ID
    const baseUrl = window.location.origin;
    setShareUrl(`${baseUrl}/verify?id=${credential.id}`);
    setIsShareModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        toast.success('Link copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy link');
      }
    );
  };

  const downloadCredentialPDF = async (credential: Credential) => {
    try {
      // Normally would generate a PDF here
      toast.success(`Downloading credential: ${credential.title}`);
      
      // Mock PDF generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a dummy PDF download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:application/pdf;charset=utf-8,');
      element.setAttribute('download', `${credential.title.replace(/\s+/g, '_')}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error downloading credential:', error);
      toast.error('Failed to download credential');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Credentials</h1>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search credentials, skills, issuers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCredentials.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-10">
          <div className="rounded-full bg-blue-50 p-3 mb-4">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No credentials found</h3>
          <p className="text-gray-500 text-center max-w-md mb-4">
            {searchQuery 
              ? "No credentials match your search" 
              : "You don't have any credentials yet"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCredentials.map((credential) => (
            <Card key={credential.id} className="h-full">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">{credential.title}</h3>
                  <p className="text-sm text-gray-500">{credential.issuer}</p>
                </div>
                <div className="rounded-full bg-green-100 p-2">
                  <Award className="h-5 w-5 text-green-600" />
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    onClick={() => handleShare(credential)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Credential Details Modal */}
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
              <h4 className="text-sm font-medium text-gray-500 mb-1">Issued On</h4>
              <p>{new Date(selectedCredential.issuedAt).toLocaleDateString()}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Token ID</h4>
              <p className="flex items-center text-sm">
                {selectedCredential.tokenId}
                <a
                  href={`https://etherscan.io/token/0xTokenContractAddress?a=${selectedCredential.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
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
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedCredential.status === 'verified' ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2 w-full mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => downloadCredentialPDF(selectedCredential)}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button 
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                setIsModalOpen(false);
                handleShare(selectedCredential);
              }}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </Modal>
      )}

      {/* Share Modal */}
      {selectedCredential && (
        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share Credential"
          description={`Share your credential "${selectedCredential.title}" with others`}
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyToClipboard}>
                Copy
              </Button>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">Share via:</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out my "${selectedCredential.title}" credential!`)}`, '_blank')}
                >
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                >
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`My ${selectedCredential.title} Credential`)}&body=${encodeURIComponent(`Check out my credential: ${shareUrl}`)}`, '_blank')}
                >
                  Email
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}; 