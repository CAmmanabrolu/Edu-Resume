import { useQuery } from '@tanstack/react-query';
import { Credential } from '../types';
import { useAuthStore } from '../store/useAuthStore';

// Simulated credentials data - replace with actual API calls
const mockCredentials: Credential[] = [
  {
    id: '1',
    title: 'Bachelor of Computer Science',
    issuer: 'Tech University',
    issuedTo: '0x1234...5678',
    issuedAt: Date.now() - 86400000 * 30, // 30 days ago
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
    issuedTo: '0x1234...5678',
    issuedAt: Date.now() - 86400000 * 15, // 15 days ago
    tokenId: '2',
    metadata: {
      description: 'Advanced web development certification',
      skills: ['React', 'Node.js', 'TypeScript'],
    },
    status: 'pending',
  },
];

export const useCredentials = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['credentials', user?.address],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockCredentials;
    },
    enabled: !!user,
  });
};