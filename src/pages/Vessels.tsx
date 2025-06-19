import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Ship, 
  Plus, 
  Search, 
  Filter, 
  Settings, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Users,
  MapPin,
  Fuel
} from 'lucide-react';

const Vessels = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const vessels = [
    {
      id: 1,
      name: "MV Cameroon Pride",
      type: "Cargo Ship",
      status: "active",
      location: "Douala Port",
      capacity: "15,000 DWT",
      crew: 18,
      nextMaintenance: "2024-01-15",
      fuelLevel: 85,
      condition: "excellent"
    },
    {
      id: 2,
      name: "MV Ocean Star",
      type: "Container Ship",
      status: "maintenance",
      location: "Limbe Shipyard",
      capacity: "8,500 TEU",
      crew: 22,
      nextMaintenance: "In Progress",
      fuelLevel: 45,
      condition: "good"
    },
    {
      id: 3,
      name: "MV Atlantic Wave",
      type: "Bulk Carrier",
      status: "active",
      location: "At Sea",
      capacity: "25,000 DWT",
      crew: 20,
      nextMaintenance: "2024-02-20",
      fuelLevel: 92,
      condition: "excellent"
    },
    {
      id: 4,
      name: "MV Coastal Guardian",
      type: "Patrol Vessel",
      status: "docked",
      location: "Kribi Port",
      capacity: "500 GT",
      crew: 12,
      nextMaintenance: "2024-01-30",
      fuelLevel: 67,
      condition: "fair"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'docked': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'fair': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const handleManageVessel = (vessel: any) => {
    toast.success(`Opening management panel for ${vessel.name}`);
    // In production, navigate to vessel management page
  };

  const handleScheduleVessel = (vessel: any) => {
    toast.success(`Opening schedule for ${vessel.name}`);
    // In production, navigate to scheduling page
  };

  const handleAddVessel = () => {
    toast.success('Opening add vessel form');
    // In production, open add vessel dialog
  };

  const filteredVessels = vessels.filter(vessel => {
    const matchesSearch = vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vessel.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || vessel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Fleet Management</h1>
          <p className="text-maritime-anchor">Monitor and manage your vessel fleet</p>
        </div>
        <Button 
          className="bg-maritime-blue hover:bg-maritime-ocean"
          onClick={handleAddVessel}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vessel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vessels</CardTitle>
            <Ship className="h-4 w-4 text-maritime-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">18</div>
            <p className="text-xs text-maritime-anchor">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">14</div>
            <p className="text-xs text-maritime-anchor">78% operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">3</div>
            <p className="text-xs text-maritime-anchor">Scheduled repairs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fuel</CardTitle>
            <Fuel className="h-4 w-4 text-maritime-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">72%</div>
            <p className="text-xs text-maritime-anchor">Fleet average</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maritime-anchor h-4 w-4" />
          <input
            type="text"
            placeholder="Search vessels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-maritime-foam rounded-lg focus:ring-2 focus:ring-maritime-blue focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className="bg-maritime-blue hover:bg-maritime-ocean"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'maintenance' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('maintenance')}
          >
            Maintenance
          </Button>
          <Button
            variant={filterStatus === 'docked' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('docked')}
          >
            Docked
          </Button>
        </div>
      </div>

      {/* Vessels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVessels.map((vessel) => (
          <Card key={vessel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-maritime-navy">{vessel.name}</CardTitle>
                  <CardDescription>{vessel.type}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getConditionIcon(vessel.condition)}
                  <Badge className={getStatusColor(vessel.status)}>
                    {vessel.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">{vessel.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ship className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">{vessel.capacity}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">{vessel.crew} crew</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">{vessel.nextMaintenance}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-maritime-anchor">Fuel Level</span>
                  <span className="text-maritime-navy">{vessel.fuelLevel}%</span>
                </div>
                <Progress value={vessel.fuelLevel} className="h-2" />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleManageVessel(vessel)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleScheduleVessel(vessel)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vessels;
