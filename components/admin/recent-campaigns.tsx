'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  _id: string;
  title: string;
  status: string;
  goalAmount: number;
  currentAmount: number;
  createdAt: string;
  userId: string;
  submittedForVerification: boolean;
}

interface RecentCampaignsProps {
  className?: string;
}

const RecentCampaigns: React.FC<RecentCampaignsProps> = ({ className }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/campaigns?limit=5&sort=createdAt&order=desc');
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        
        const data = await response.json();
        console.log(data);
        setCampaigns(data.campaigns || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load recent campaigns');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : campaigns.length === 0 ? (
        <div className="text-gray-500 py-4">No campaigns found</div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-start">
                <Link href={`/admin/campaigns/${campaign._id}`} className="text-blue-600 hover:underline font-medium">
                  {campaign.title}
                </Link>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Created {new Date(campaign.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Goal: ${campaign.goalAmount.toLocaleString()}</span>
                {campaign.currentAmount > 0 && (
                  <span className="ml-3 text-gray-600">
                    Raised: ${campaign.currentAmount.toLocaleString()} 
                    ({Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}%)
                  </span>
                )}
              </div>
              {campaign.submittedForVerification && campaign.status === 'pending' && (
                <div className="mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Awaiting verification
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t">
        <Link href="/admin/campaigns" className="text-sm text-blue-600 hover:underline">
          View all campaigns →
        </Link>
      </div>
    </div>
  );
};

export default RecentCampaigns;
