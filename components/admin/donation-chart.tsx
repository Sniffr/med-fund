'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import RechartsWrapper from './recharts-wrapper';

interface DonationChartProps {
  className?: string;
}

interface ChartData {
  _id: string;
  total: number;
  count: number;
  name?: string;
}

const DonationChart: React.FC<DonationChartProps> = ({ className }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/donations/chart?period=${period}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        
        const data = await response.json();
        
        // Format data for chart
        const formattedData = data.map((item: ChartData) => ({
          ...item,
          name: item._id,
        }));
        
        setChartData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load donation data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [period]);

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'year') => {
    setPeriod(newPeriod);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Donation Overview</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePeriodChange('week')}
            className={`px-3 py-1 text-sm rounded ${
              period === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-3 py-1 text-sm rounded ${
              period === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handlePeriodChange('year')}
            className={`px-3 py-1 text-sm rounded ${
              period === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Year
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse">Loading chart data...</div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No donation data available for this period
        </div>
      ) : (
        <div className="h-64">
          <RechartsWrapper height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="Donation Amount" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                name="Number of Donations" 
                stroke="#10b981" 
              />
            </LineChart>
          </RechartsWrapper>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        {!loading && !error && chartData.length > 0 && (
          <div className="flex justify-between">
            <div>
              Total: ${chartData.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            </div>
            <div>
              Count: {chartData.reduce((sum, item) => sum + item.count, 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationChart;
