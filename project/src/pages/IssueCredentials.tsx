import React, { useState, useEffect } from 'react';
import { Award, Calendar, Upload, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import { issueCredential, useMockBlockchain } from '../lib/blockchain';
import { Credential } from '../types';

export const IssueCredentials: React.FC = () => {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myIssuedCredentials, setMyIssuedCredentials] = useState<Credential[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    description: '',
    expirationDate: '',
    recipientAddress: '',
    skills: '',
    imageUrl: '',
  });

  useEffect(() => {
    // In a real app, we would load the user's issued credentials from the blockchain
    // For now, let's use mock data
    setMyIssuedCredentials([
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
        status: 'verified',
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
        status: 'verified',
      },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.issuer || !formData.recipientAddress) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Simple validation for Ethereum address
    if (!formData.recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare metadata
      const metadata = {
        title: formData.title,
        issuer: formData.issuer,
        description: formData.description,
        expirationDate: formData.expirationDate,
        imageUrl: formData.imageUrl,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      };
      
      // Issue credential on the blockchain
      if (!useMockBlockchain) {
        const tokenId = await issueCredential(formData.recipientAddress, metadata);
        
        if (!tokenId) {
          throw new Error('Failed to issue credential on the blockchain');
        }
        
        // Add the new credential to our state
        const newCredential: Credential = {
          id: tokenId,
          title: formData.title,
          issuer: formData.issuer,
          issuedTo: formData.recipientAddress,
          issuedAt: Date.now(),
          tokenId,
          metadata: {
            description: formData.description,
            skills: metadata.skills,
          },
          status: 'verified',
        };
        
        setMyIssuedCredentials(prev => [newCredential, ...prev]);
      } else {
        // Mock implementation for development
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Generate a random token ID
        const tokenId = Math.floor(Math.random() * 1000000).toString();
        
        // Add the new credential to our state
        const newCredential: Credential = {
          id: tokenId,
          title: formData.title,
          issuer: formData.issuer,
          issuedTo: formData.recipientAddress,
          issuedAt: Date.now(),
          tokenId,
          metadata: {
            description: formData.description,
            skills: metadata.skills,
          },
          status: 'verified',
        };
        
        setMyIssuedCredentials(prev => [newCredential, ...prev]);
        toast.success(`Successfully issued credential: ${formData.title}`);
      }
      
      // Reset form
      setFormData({
        title: '',
        issuer: '',
        description: '',
        expirationDate: '',
        recipientAddress: '',
        skills: '',
        imageUrl: '',
      });
    } catch (error) {
      console.error("Error issuing credential:", error);
      toast.error("Failed to issue credential. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show a warning if the user is not an issuer
  if (user && user.role !== 'issuer') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Issue Credentials</h1>
        </div>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p>
                You need to be registered as a credential issuer to use this feature. 
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
        <h1 className="text-3xl font-bold text-gray-900">Issue Credentials</h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-white border-b pb-4">
          <h2 className="text-xl font-semibold">Issue New Credential</h2>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1">
                  Issuer *
                </label>
                <Input
                  id="issuer"
                  name="issuer"
                  placeholder="e.g. University of Technology"
                  value={formData.issuer}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter details about this credential"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Address *
              </label>
              <Input
                id="recipientAddress"
                name="recipientAddress"
                placeholder="0x..."
                value={formData.recipientAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <Input
                id="skills"
                name="skills"
                placeholder="e.g. Programming, Algorithms, Data Structures"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full md:w-auto"
              isLoading={isSubmitting}
              disabled={isSubmitting || !user}
            >
              {isSubmitting ? "Issuing..." : "Issue Credential"}
            </Button>
            
            {useMockBlockchain && (
              <p className="text-xs text-gray-500 mt-2">
                Running in development mode with mock blockchain. In production, this would create a real credential NFT.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Issued Credentials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myIssuedCredentials.map((credential) => (
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
                <p className="text-sm text-gray-500">
                  {credential.metadata.description || "No description available"}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Issued to: {shortenAddress(credential.issuedTo)}</p>
                </div>
                {credential.metadata.skills && credential.metadata.skills.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {credential.metadata.skills.map((skill, index) => (
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
              </CardContent>
              
              <CardFooter className="border-t pt-4 flex justify-end">
                <div className="flex gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Valid
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to shorten address
function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}