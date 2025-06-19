
import React from 'react';
import { ClockInOut } from '@/components/time-tracking/ClockInOut';

const ClockInOutPage = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-maritime-navy mb-2">Time Tracking</h1>
        <p className="text-gray-600">Clock in and out to track your work hours</p>
      </div>
      
      <div className="flex justify-center">
        <ClockInOut />
      </div>
    </div>
  );
};

export default ClockInOutPage;
