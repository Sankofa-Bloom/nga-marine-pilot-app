
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface TimeEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out?: string;
  clock_in_location: LocationData;
  clock_out_location?: LocationData;
  status: 'clocked-in' | 'clocked-out';
}

interface AllowedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  is_active: boolean;
}

export const useTimeTracking = () => {
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [allowedLocations, setAllowedLocations] = useState<AllowedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkCurrentEntry();
      fetchAllowedLocations();
    }
  }, [user]);

  const checkCurrentEntry = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'clocked-in')
      .maybeSingle();

    if (data && !error) {
      setCurrentEntry({
        ...data,
        clock_in_location: data.clock_in_location as LocationData,
        clock_out_location: data.clock_out_location as LocationData | undefined
      });
    }
  };

  const fetchAllowedLocations = async () => {
    const { data, error } = await supabase
      .from('allowed_locations')
      .select('*')
      .eq('is_active', true);

    if (data && !error) {
      setAllowedLocations(data);
    }
  };

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    // Simple reverse geocoding - in production, use a proper service
    return `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  const isLocationAllowed = async (lat: number, lng: number): Promise<boolean> => {
    // Check if user has "can_clock_in_anywhere" permission
    const { data: permissions } = await supabase
      .from('user_location_permissions')
      .select('can_clock_in_anywhere, location_id')
      .eq('user_id', user?.id);

    if (permissions?.some(p => p.can_clock_in_anywhere)) {
      return true;
    }

    // Check if within allowed location radius
    for (const location of allowedLocations) {
      const distance = calculateDistance(lat, lng, location.latitude, location.longitude);
      if (distance <= location.radius_meters) {
        return true;
      }
    }

    return false;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const clockIn = async () => {
    if (!user) return false;

    setLoading(true);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      const locationAllowed = await isLocationAllowed(latitude, longitude);
      if (!locationAllowed) {
        toast.error('You are not authorized to clock in from this location');
        setLoading(false);
        return false;
      }

      const address = await getAddressFromCoordinates(latitude, longitude);
      const locationData: LocationData = { latitude, longitude, address };

      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          user_id: user.id,
          clock_in_location: locationData,
          status: 'clocked-in'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentEntry({
        ...data,
        clock_in_location: data.clock_in_location as LocationData,
        clock_out_location: data.clock_out_location as LocationData | undefined
      });
      toast.success('Clocked in successfully!');
      return true;
    } catch (error) {
      console.error('Clock-in error:', error);
      toast.error('Failed to clock in');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    if (!user || !currentEntry) return false;

    setLoading(true);
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const address = await getAddressFromCoordinates(latitude, longitude);
      const locationData: LocationData = { latitude, longitude, address };

      const { error } = await supabase
        .from('time_entries')
        .update({
          clock_out: new Date().toISOString(),
          clock_out_location: locationData,
          status: 'clocked-out'
        })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setCurrentEntry(null);
      toast.success('Clocked out successfully!');
      return true;
    } catch (error) {
      console.error('Clock-out error:', error);
      toast.error('Failed to clock out');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestLocationAccess = async (reason: string) => {
    if (!user) return false;

    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const address = await getAddressFromCoordinates(latitude, longitude);
      const locationData: LocationData = { latitude, longitude, address };

      const { error } = await supabase
        .from('location_access_requests')
        .insert({
          user_id: user.id,
          requested_location: locationData,
          reason
        });

      if (error) throw error;

      toast.success('Location access request submitted');
      return true;
    } catch (error) {
      console.error('Request error:', error);
      toast.error('Failed to submit request');
      return false;
    }
  };

  return {
    currentEntry,
    allowedLocations,
    loading,
    clockIn,
    clockOut,
    requestLocationAccess
  };
};
