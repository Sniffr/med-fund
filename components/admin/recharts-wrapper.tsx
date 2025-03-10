'use client';

import React, { ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

interface RechartsWrapperProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  aspect?: number;
}

/**
 * A wrapper component for Recharts to handle SSR
 * This is needed because Recharts uses window which is not available during SSR
 */
const RechartsWrapper: React.FC<RechartsWrapperProps> = ({
  children,
  width = '100%',
  height = 300,
  aspect,
}) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        style={{ 
          width: typeof width === 'number' ? `${width}px` : width, 
          height: typeof height === 'number' ? `${height}px` : height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem'
        }}
      >
        <div className="animate-pulse">Loading chart...</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width={width} height={height} aspect={aspect}>
      {React.Children.only(children)}
    </ResponsiveContainer>
  );
};

export default RechartsWrapper;
