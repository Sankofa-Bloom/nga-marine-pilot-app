
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Play, Square } from 'lucide-react';
import { toast } from 'sonner';

interface TimeEntry {
  id: string;
  clockIn: string;
  clockOut?: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'clocked-in' | 'clocked-out';
}

export const ClockInOut = () => {
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    // Check for existing clock-in entry
    const storedEntry = localStorage.getItem('current_time_entry');
    if (storedEntry) {
      setCurrentEntry(JSON.parse(storedEntry));
    }

    // Get current location
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const clockIn = async () => {
    if (!location) {
      toast.error('Location is required for clock-in');
      return;
    }

    setLoading(true);
    try {
      // Get address from coordinates (using a reverse geocoding service)
      const address = await getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      const entry: TimeEntry = {
        id: crypto.randomUUID(),
        clockIn: new Date().toISOString(),
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address
        },
        status: 'clocked-in'
      };

      setCurrentEntry(entry);
      localStorage.setItem('current_time_entry', JSON.stringify(entry));
      
      // In production, save to Supabase database
      toast.success('Clocked in successfully!');
    } catch (error) {
      console.error('Clock-in error:', error);
      toast.error('Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    if (!currentEntry || !location) {
      toast.error('No active clock-in found or location unavailable');
      return;
    }

    setLoading(true);
    try {
      const updatedEntry = {
        ...currentEntry,
        clockOut: new Date().toISOString(),
        status: 'clocked-out' as const
      };

      setCurrentEntry(null);
      localStorage.removeItem('current_time_entry');
      
      // Save completed entry to history
      const timeHistory = JSON.parse(localStorage.getItem('time_history') || '[]');
      timeHistory.push(updatedEntry);
      localStorage.setItem('time_history', JSON.stringify(timeHistory));
      
      // In production, save to Supabase database
      toast.success('Clocked out successfully!');
    } catch (error) {
      console.error('Clock-out error:', error);
      toast.error('Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    // This is a placeholder - in production, use a geocoding service
    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString();
  };

  const calculateWorkTime = () => {
    if (!currentEntry) return '0:00';
    
    const start = new Date(currentEntry.clockIn);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
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
                <span>Started: {formatTime(currentEntry.clockIn)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="truncate">{currentEntry.location.address}</span>
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

            {location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Location ready</span>
              </div>
            )}

            <Button 
              onClick={clockIn} 
              disabled={loading || !location}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {loading ? 'Clocking In...' : 'Clock In'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
