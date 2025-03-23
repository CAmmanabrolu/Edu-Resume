import React from 'react';
import { Award, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Credential } from '../../types';
import { shortenAddress, formatDate } from '../../lib/utils';
import { toast } from 'sonner';

interface CredentialCardProps {
  credential: Credential;
  onVerify?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onVerify,
  onShare,
}) => {
  const handleShare = () => {
    if (onShare) {
      onShare(credential.id);
    } else {
      // Fallback share functionality
      toast.success('Share link copied to clipboard!');
      navigator.clipboard.writeText(`https://eduresume.io/credentials/${credential.id}`);
    }
  };

  const getStatusIcon = () => {
    switch (credential.status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (credential.status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Pending Verification';
      case 'rejected':
        return 'Verification Rejected';
      default:
        return '';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{credential.title}</h3>
          <p className="text-sm text-gray-500">{credential.issuer}</p>
        </div>
        <div className="rounded-full bg-blue-100 p-2">
          <Award className="h-5 w-5 text-blue-600" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <User className="mr-2 h-4 w-4" />
            Issued to: {shortenAddress(credential.issuedTo, 6)}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            Issued on: {formatDate(credential.issuedAt)}
          </div>
          
          {credential.metadata.skills && credential.metadata.skills.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {credential.metadata.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-col gap-3">
        <div className="flex items-center text-sm">
          {getStatusIcon()}
          <span className="ml-2">{getStatusText()}</span>
        </div>
        
        <div className="flex gap-2 w-full">
          {onVerify && credential.status !== 'verified' && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onVerify(credential.id)}
            >
              Verify
            </Button>
          )}
          
          <Button
            variant={onVerify && credential.status !== 'verified' ? 'outline' : 'primary'}
            className={`${!onVerify || credential.status === 'verified' ? 'flex-1' : ''}`}
            onClick={handleShare}
          >
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 