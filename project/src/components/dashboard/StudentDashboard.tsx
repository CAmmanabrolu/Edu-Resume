import React from 'react';
import { Award, Clock, CheckCircle } from 'lucide-react';
import { useCredentials } from '../../hooks/useCredentials';
import { CredentialCard } from '../credentials/CredentialCard';

export const StudentDashboard: React.FC = () => {
  const { data: credentials, isLoading } = useCredentials();

  const stats = [
    {
      label: 'Total Credentials',
      value: credentials?.length ?? 0,
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Verification',
      value: credentials?.filter(c => c.status === 'pending').length ?? 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Verified',
      value: credentials?.filter(c => c.status === 'verified').length ?? 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Credentials</h2>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {credentials?.slice(0, 3).map((credential) => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};