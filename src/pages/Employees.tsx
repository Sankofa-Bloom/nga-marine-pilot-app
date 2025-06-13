
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  FileText
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  avatar?: string;
}

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const employees: Employee[] = [
    {
      id: 1,
      name: "Jean Paul Mbarga",
      position: "Captain",
      department: "Operations",
      email: "jp.mbarga@ngamarine.com",
      phone: "+237 6 77 88 99 00",
      location: "Douala Port",
      status: "active",
      joinDate: "2022-03-15"
    },
    {
      id: 2,
      name: "Marie Douala",
      position: "Chief Engineer",
      department: "Engineering",
      email: "m.douala@ngamarine.com",
      phone: "+237 6 99 88 77 66",
      location: "MV Ocean Star",
      status: "active",
      joinDate: "2021-08-20"
    },
    {
      id: 3,
      name: "Pierre Yaounde",
      position: "Deck Officer",
      department: "Operations",
      email: "p.yaounde@ngamarine.com",
      phone: "+237 6 55 44 33 22",
      location: "MV Cameroon Pride",
      status: "on-leave",
      joinDate: "2023-01-10"
    },
    {
      id: 4,
      name: "Agnes Bamenda",
      position: "HR Manager",
      department: "Administration",
      email: "a.bamenda@ngamarine.com",
      phone: "+237 6 11 22 33 44",
      location: "Head Office",
      status: "active",
      joinDate: "2020-11-05"
    }
  ];

  const departments = ['all', 'Operations', 'Engineering', 'Administration', 'Finance'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Employee Management</h1>
          <p className="text-maritime-anchor">Manage your crew members and staff</p>
        </div>
        <Button className="bg-maritime-blue hover:bg-maritime-ocean">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Total Employees</p>
                <p className="text-2xl font-bold text-maritime-navy">{employees.length}</p>
              </div>
              <Users className="w-8 h-8 text-maritime-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {employees.filter(e => e.status === 'on-leave').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-maritime-anchor">Departments</p>
                <p className="text-2xl font-bold text-maritime-navy">{departments.length - 1}</p>
              </div>
              <Filter className="w-8 h-8 text-maritime-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maritime-anchor w-4 h-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-maritime-navy"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback className="bg-maritime-blue text-white">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-maritime-navy">{employee.name}</h3>
                    <p className="text-sm text-maritime-anchor">{employee.position}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-maritime-anchor" />
                <span className="text-maritime-anchor truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-maritime-anchor" />
                <span className="text-maritime-anchor">{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-maritime-anchor" />
                <span className="text-maritime-anchor">{employee.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-maritime-anchor" />
                <span className="text-maritime-anchor">Joined {employee.joinDate}</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button size="sm" className="flex-1 bg-maritime-blue hover:bg-maritime-ocean">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-maritime-anchor mx-auto mb-4" />
            <p className="text-maritime-anchor">No employees found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Employees;
