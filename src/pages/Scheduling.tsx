
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Ship, 
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Shift {
  id: number;
  employeeName: string;
  vessel: string;
  startTime: string;
  endTime: string;
  position: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  date: string;
}

const Scheduling = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const shifts: Shift[] = [
    {
      id: 1,
      employeeName: "Jean Paul Mbarga",
      vessel: "MV Ocean Star",
      startTime: "06:00",
      endTime: "18:00",
      position: "Captain",
      status: "ongoing",
      date: "2024-12-13"
    },
    {
      id: 2,
      employeeName: "Marie Douala",
      vessel: "MV Ocean Star",
      startTime: "06:00",
      endTime: "18:00",
      position: "Chief Engineer",
      status: "ongoing",
      date: "2024-12-13"
    },
    {
      id: 3,
      employeeName: "Pierre Yaounde",
      vessel: "MV Cameroon Pride",
      startTime: "18:00",
      endTime: "06:00",
      position: "Deck Officer",
      status: "scheduled",
      date: "2024-12-13"
    },
    {
      id: 4,
      employeeName: "Agnes Bamenda",
      vessel: "Head Office",
      startTime: "08:00",
      endTime: "17:00",
      position: "HR Manager",
      status: "scheduled",
      date: "2024-12-14"
    }
  ];

  const vessels = ["MV Ocean Star", "MV Cameroon Pride", "MV Atlantic Wave", "Head Office"];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const todayShifts = shifts.filter(shift => shift.date === currentDate.toISOString().split('T')[0]);
  const weekDays = getWeekDays(currentDate);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Scheduling & Rostering</h1>
          <p className="text-maritime-anchor">Manage crew schedules and vessel assignments</p>
        </div>
        <Button className="bg-maritime-blue hover:bg-maritime-ocean">
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Today's Shifts</p>
                <p className="text-2xl font-bold text-maritime-navy">{todayShifts.length}</p>
              </div>
              <Clock className="w-8 h-8 text-maritime-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Active Crew</p>
                <p className="text-2xl font-bold text-green-600">
                  {shifts.filter(s => s.status === 'ongoing').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Vessels Scheduled</p>
                <p className="text-2xl font-bold text-maritime-navy">
                  {new Set(shifts.map(s => s.vessel)).size}
                </p>
              </div>
              <Ship className="w-8 h-8 text-maritime-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">
                  {shifts.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold text-maritime-navy">
                {formatDate(currentDate)}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Week View */}
      {viewMode === 'week' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-maritime-navy">Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <div key={index} className="min-h-[200px] border border-maritime-foam rounded-lg p-2">
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium text-maritime-navy">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-maritime-navy">
                      {day.getDate()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {shifts
                      .filter(shift => shift.date === day.toISOString().split('T')[0])
                      .map(shift => (
                        <div
                          key={shift.id}
                          className="text-xs p-2 bg-maritime-foam rounded border-l-2 border-maritime-blue"
                        >
                          <p className="font-medium text-maritime-navy truncate">
                            {shift.employeeName}
                          </p>
                          <p className="text-maritime-anchor">{shift.vessel}</p>
                          <p className="text-maritime-anchor">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Today's Schedule</CardTitle>
          <CardDescription>Current and upcoming shifts for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayShifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg hover:bg-maritime-foam transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-maritime-blue rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-maritime-navy">{shift.employeeName}</h3>
                    <p className="text-sm text-maritime-anchor">{shift.position}</p>
                    <p className="text-sm text-maritime-anchor">{shift.vessel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-maritime-navy">
                    {shift.startTime} - {shift.endTime}
                  </p>
                  <Badge className={getStatusColor(shift.status)}>
                    {shift.status}
                  </Badge>
                </div>
              </div>
            ))}
            {todayShifts.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-maritime-anchor mx-auto mb-4" />
                <p className="text-maritime-anchor">No shifts scheduled for today.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vessel Assignment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Vessel Assignments</CardTitle>
          <CardDescription>Current crew assignments by vessel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vessels.map((vessel) => {
              const vesselShifts = shifts.filter(s => s.vessel === vessel && s.status === 'ongoing');
              return (
                <div key={vessel} className="p-4 border border-maritime-foam rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-maritime-navy">{vessel}</h3>
                    <Ship className="w-5 h-5 text-maritime-blue" />
                  </div>
                  <div className="space-y-2">
                    {vesselShifts.length > 0 ? (
                      vesselShifts.map(shift => (
                        <div key={shift.id} className="text-sm">
                          <p className="font-medium text-maritime-navy">{shift.employeeName}</p>
                          <p className="text-maritime-anchor">{shift.position}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-maritime-anchor">No active crew</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scheduling;
