'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Campaign {
  _id: string;
  title: string;
  status: string;
  goalAmount: number;
  currentAmount: number;
  createdAt: string;
  userId: string;
  submittedForVerification: boolean;
  medicalCondition: string;
}

interface VerificationQueueProps {
  className?: string;
}

const VerificationQueue: React.FC<VerificationQueueProps> = ({ className }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/campaigns?submittedForVerification=true&status=pending');
        
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        
        const data = await response.json();
        setCampaigns(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load verification queue');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/campaigns/${id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify campaign');
      }
      
      // Update local state
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
    } catch (err) {
      console.error('Error verifying campaign:', err);
      alert('Failed to verify campaign. Please try again.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      
      if (reason === null) {
        return; // User cancelled
      }
      
      const response = await fetch(`/api/admin/campaigns/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject campaign');
      }
      
      // Update local state
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      alert('Failed to reject campaign. Please try again.');
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Verification Queue</h3>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
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
        <div className="text-gray-500 py-4">No campaigns awaiting verification</div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="border p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <Link href={`/admin/campaigns/${campaign._id}`} className="text-blue-600 hover:underline font-medium">
                  {campaign.title}
                </Link>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Pending verification
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Submitted {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
              </div>
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Medical condition: {campaign.medicalCondition || 'Not specified'}</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Goal: ${campaign.goalAmount.toLocaleString()}</span>
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleVerify(campaign._id)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleReject(campaign._id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
                <Link
                  href={`/admin/campaigns/${campaign._id}`}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && !error && campaigns.length > 0 ? (
        <div className="mt-4 pt-3 border-t">
          <Link href="/admin/campaigns?submittedForVerification=true&status=pending" className="text-sm text-blue-600 hover:underline">
            View all pending verifications →
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default VerificationQueue;
