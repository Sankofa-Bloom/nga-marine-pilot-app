
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Users, Settings, Plus, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TimeEntry {
  id: string;
  user_id: string;
  clock_in: string;
  clock_out?: string;
  clock_in_location: any;
  clock_out_location?: any;
  status: string;
  profiles: { name: string; email: string };
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

interface LocationRequest {
  id: string;
  user_id: string;
  requested_location: any;
  reason: string;
  status: string;
  requested_at: string;
  profiles: { name: string; email: string };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const TimeTracking = () => {
  const { user } = useAuth();
  const [activeEntries, setActiveEntries] = useState<TimeEntry[]>([]);
  const [locations, setLocations] = useState<AllowedLocation[]>([]);
  const [requests, setRequests] = useState<LocationRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    radius_meters: 100
  });

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchActiveEntries();
      fetchLocations();
      fetchRequests();
      fetchUsers();
    }
  }, [user]);

  const fetchActiveEntries = async () => {
    const { data, error } = await supabase
      .from('time_entries')
      .select(`
        *,
        profiles:user_id (name, email)
      `)
      .eq('status', 'clocked-in')
      .order('clock_in', { ascending: false });

    if (data && !error) {
      setActiveEntries(data);
    }
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('allowed_locations')
      .select('*')
      .order('name');

    if (data && !error) {
      setLocations(data);
    }
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('location_access_requests')
      .select(`
        *,
        profiles:user_id (name, email)
      `)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (data && !error) {
      setRequests(data);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email')
      .order('name');

    if (data && !error) {
      setUsers(data);
    }
  };

  const addLocation = async () => {
    const { error } = await supabase
      .from('allowed_locations')
      .insert({
        name: newLocation.name,
        address: newLocation.address,
        latitude: parseFloat(newLocation.latitude),
        longitude: parseFloat(newLocation.longitude),
        radius_meters: newLocation.radius_meters
      });

    if (!error) {
      toast.success('Location added successfully');
      setShowLocationDialog(false);
      setNewLocation({ name: '', address: '', latitude: '', longitude: '', radius_meters: 100 });
      fetchLocations();
    } else {
      toast.error('Failed to add location');
    }
  };

  const toggleLocationStatus = async (locationId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('allowed_locations')
      .update({ is_active: !isActive })
      .eq('id', locationId);

    if (!error) {
      toast.success('Location status updated');
      fetchLocations();
    }
  };

  const handleRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('location_access_requests')
      .update({ 
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (!error) {
      toast.success(`Request ${status}`);
      fetchRequests();
    }
  };

  const setUserAnywhere = async (userId: string, canClockAnywhere: boolean) => {
    // First, remove existing permissions
    await supabase
      .from('user_location_permissions')
      .delete()
      .eq('user_id', userId);

    // Add new permission
    const { error } = await supabase
      .from('user_location_permissions')
      .insert({
        user_id: userId,
        can_clock_in_anywhere: canClockAnywhere
      });

    if (!error) {
      toast.success('User permissions updated');
    }
  };

  const formatDuration = (clockIn: string) => {
    const start = new Date(clockIn);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (user?.role !== 'admin' && user?.role !== 'manager') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p>Access denied. This page is for administrators and managers only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-maritime-navy">Time Tracking Management</h1>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Clock-ins</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="requests">Access Requests</TabsTrigger>
          <TabsTrigger value="permissions">User Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Currently Clocked In ({activeEntries.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeEntries.length === 0 ? (
                <p className="text-gray-500">No employees currently clocked in</p>
              ) : (
                <div className="space-y-4">
                  {activeEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">{entry.profiles.name}</h3>
                        <p className="text-sm text-gray-500">{entry.profiles.email}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Started: {new Date(entry.clock_in).toLocaleTimeString()}</span>
                          <span>Duration: {formatDuration(entry.clock_in)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{entry.clock_in_location.address}</span>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Allowed Locations</h2>
            <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={newLocation.latitude}
                        onChange={(e) => setNewLocation({...newLocation, latitude: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={newLocation.longitude}
                        onChange={(e) => setNewLocation({...newLocation, longitude: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="radius">Radius (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      value={newLocation.radius_meters}
                      onChange={(e) => setNewLocation({...newLocation, radius_meters: parseInt(e.target.value)})}
                    />
                  </div>
                  <Button onClick={addLocation} className="w-full">
                    Add Location
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <p className="text-xs text-gray-500">
                        {location.latitude}, {location.longitude} • {location.radius_meters}m radius
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={location.is_active ? "default" : "secondary"}>
                        {location.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={location.is_active}
                        onCheckedChange={() => toggleLocationStatus(location.id, location.is_active)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Access Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-gray-500">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-medium">{request.profiles.name}</h3>
                          <p className="text-sm text-gray-600">{request.reason}</p>
                          <p className="text-xs text-gray-500">
                            Location: {request.requested_location.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested: {new Date(request.requested_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleRequest(request.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRequest(request.id, 'rejected')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Clock-in Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((userProfile) => (
                  <div key={userProfile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{userProfile.name}</h3>
                      <p className="text-sm text-gray-600">{userProfile.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`anywhere-${userProfile.id}`} className="text-sm">
                        Clock in from anywhere
                      </Label>
                      <Switch
                        id={`anywhere-${userProfile.id}`}
                        onCheckedChange={(checked) => setUserAnywhere(userProfile.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeTracking;
