import React from 'react';
import { format } from 'date-fns';
import { Shield, ExternalLink, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '../ui/Card';
import { Button } from '../ui/Button';
import { Credential } from '../../types';
import { cn } from '../../lib/utils';

interface CredentialCardProps {
  credential: Credential;
  onShare?: () => void;
  onVerify?: () => void;
  className?: string;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onShare,
  onVerify,
  className,
}) => {
  const { title, issuer, issuedAt, status, metadata } = credential;
  
  const statusConfig = {
    pending: {
      color: 'text-yellow-500 bg-yellow-50',
      icon: <Clock className="h-5 w-5" />,
      text: 'Pending Verification',
    },
    verified: {
      color: 'text-green-500 bg-green-50',
      icon: <CheckCircle className="h-5 w-5" />,
      text: 'Verified',
    },
    rejected: {
      color: 'text-red-500 bg-red-50',
      icon: <XCircle className="h-5 w-5" />,
      text: 'Rejected',
    },
  };

  const { color, icon, text } = statusConfig[status] || {
    color: 'text-gray-500 bg-gray-50',
    icon: <HelpCircle className="h-5 w-5" />,
    text: 'Unknown',
  };

  return (
    <Card 
      variant="credential" 
      className={cn("overflow-hidden", className)}
    >
      <div className={cn('px-4 py-2 font-medium flex items-center gap-2', color)}>
        {icon}
        <span>{text}</span>
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Shield className="h-5 w-5 text-blue-500" />
        </div>
        <CardDescription>
          Issued by {issuer} on {format(new Date(issuedAt), 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-700 mb-3">{metadata.description}</p>
        
        {metadata.skills && metadata.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {metadata.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {metadata.validUntil && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Valid until {format(new Date(metadata.validUntil), 'MMM d, yyyy')}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        {status !== 'verified' && onVerify && (
          <Button variant="outline" size="sm" onClick={onVerify}>
            Request Verification
          </Button>
        )}
        
        {status === 'verified' && onShare && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onShare}
            leftIcon={<ExternalLink className="h-4 w-4" />}
          >
            Share Credential
          </Button>
        )}
        
        <a 
          href={`https://eduscan.io/token/${credential.tokenId}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View on EDU Chain
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
};