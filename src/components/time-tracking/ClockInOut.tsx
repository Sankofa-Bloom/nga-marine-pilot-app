
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, MapPin, Play, Square, AlertTriangle, MessageSquare } from 'lucide-react';
import { useTimeTracking } from '@/hooks/useTimeTracking';

export const ClockInOut = () => {
  const { currentEntry, loading, clockIn, clockOut, requestLocationAccess } = useTimeTracking();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestReason, setRequestReason] = useState('');

  const handleClockIn = async () => {
    const success = await clockIn();
    if (!success) {
      setShowRequestDialog(true);
    }
  };

  const handleLocationRequest = async () => {
    const success = await requestLocationAccess(requestReason);
    if (success) {
      setShowRequestDialog(false);
      setRequestReason('');
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString();
  };

  const calculateWorkTime = () => {
    if (!currentEntry) return '0:00';
    
    const start = new Date(currentEntry.clock_in);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Time Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentEntry ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800">
                  Clocked In
                </Badge>
                <span className="font-mono text-lg">{calculateWorkTime()}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Started: {formatTime(currentEntry.clock_in)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{currentEntry.clock_in_location.address}</span>
                </div>
              </div>

              <Button 
                onClick={clockOut} 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Square className="h-4 w-4 mr-2" />
                {loading ? 'Clocking Out...' : 'Clock Out'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Not clocked in</p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleClockIn} 
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loading ? 'Clocking In...' : 'Clock In'}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Request Admin Approval
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span>Request Location Access</span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        If you're unable to clock in from your current location, please provide a reason and request admin approval.
                      </p>
                      <Textarea
                        placeholder="Please explain why you need to clock in from this location..."
                        value={requestReason}
                        onChange={(e) => setRequestReason(e.target.value)}
                      />
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleLocationRequest}
                          disabled={!requestReason.trim()}
                          className="flex-1"
                        >
                          Submit Request
                        </Button>
                        <Button 
                          onClick={() => setRequestReason('')}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Location Access Required</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You are not authorized to clock in from this location. Please request access from your administrator.
            </p>
            <Textarea
              placeholder="Reason for requesting access from this location..."
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleLocationRequest}
                disabled={!requestReason.trim()}
                className="flex-1"
              >
                Request Access
              </Button>
              <Button 
                onClick={() => setShowRequestDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
