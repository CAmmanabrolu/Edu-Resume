import React from 'react';
import { SearchIcon, Filter, Share2, Download } from 'lucide-react';
import { useCredentials } from '../hooks/useCredentials';
import { CredentialCard } from '../components/credential/CredentialCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Credential } from '../types';
import { downloadJSON } from '../lib/utils';
import { toast } from 'sonner';

export const CredentialWallet: React.FC = () => {
  const { data: credentials = [], isLoading } = useCredentials();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'verified' | 'pending'>('all');
  const [selectedCredential, setSelectedCredential] = React.useState<Credential | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  const filteredCredentials = React.useMemo(() => {
    return credentials.filter((credential) => {
      const matchesSearch = 
        credential.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credential.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credential.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        credential.metadata.skills.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesFilter = 
        filterStatus === 'all' || 
        credential.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [credentials, searchQuery, filterStatus]);

  const handleVerifyRequest = (credential: Credential) => {
    // In a real implementation, this would trigger a blockchain transaction
    toast.success(`Verification request sent for "${credential.title}"`);
  };

  const handleShareCredential = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsShareModalOpen(true);
  };

  const handleExportCredentials = () => {
    downloadJSON(credentials, 'edu-credentials.json');
    toast.success('Credentials exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Credentials</h1>
        
        <div className="flex gap-2">
          <Button 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 h-8 px-3 text-xs" 
            onClick={handleExportCredentials}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            className={`h-8 px-3 text-xs ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            className={`h-8 px-3 text-xs ${filterStatus === 'verified' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
            onClick={() => setFilterStatus('verified')}
          >
            Verified
          </Button>
          <Button
            className={`h-8 px-3 text-xs ${filterStatus === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : filteredCredentials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Filter className="h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No credentials found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter settings' 
              : 'Your credentials will appear here once you receive them'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCredentials.map((credential) => (
            <CredentialCard 
              key={credential.id} 
              credential={credential} 
              onVerify={() => handleVerifyRequest(credential)}
              onShare={() => handleShareCredential(credential)}
            />
          ))}
        </div>
      )}
      
      {/* Share Credential Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Credential"
        description="Choose how you want to share your credential"
      >
        {selectedCredential && (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="font-medium text-gray-900">{selectedCredential.title}</h3>
              <p className="text-sm text-gray-500">Issued by {selectedCredential.issuer}</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700" 
                onClick={() => {
                  // In a real app, this would generate a share link
                  toast.success('Share link copied to clipboard');
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>
              
              <Button 
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                onClick={() => {
                  downloadJSON(selectedCredential, `credential-${selectedCredential.id}.json`);
                  toast.success('Credential exported successfully');
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Credential JSON
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};