import React from 'react';
import { Award, Clock, CheckCircle } from 'lucide-react';

export const IssuerDashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Credentials Issued',
      value: 0,
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pending Issuance',
      value: 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Active Verifications',
      value: 0,
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
        <h2 className="text-lg font-semibold mb-4">Recent Issuance Requests</h2>
        <p className="text-gray-600">No issuance requests yet.</p>
      </div>
    </div>
  );
};