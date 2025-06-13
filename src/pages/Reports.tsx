
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Ship,
  DollarSign,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const reports = [
    {
      id: 1,
      name: "Monthly Fleet Performance",
      description: "Comprehensive analysis of vessel performance and efficiency",
      type: "operational",
      lastGenerated: "2024-01-12",
      status: "completed",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Financial Summary Q4 2023",
      description: "Quarterly financial report with budget analysis",
      type: "financial",
      lastGenerated: "2024-01-08",
      status: "completed",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Employee Productivity Report",
      description: "Staff performance and productivity metrics",
      type: "hr",
      lastGenerated: "2024-01-10",
      status: "pending",
      size: "0.9 MB"
    },
    {
      id: 4,
      name: "Maintenance Cost Analysis",
      description: "Analysis of maintenance costs and patterns",
      type: "maintenance",
      lastGenerated: "2024-01-05",
      status: "completed",
      size: "1.2 MB"
    }
  ];

  const reportTemplates = [
    {
      name: "Vessel Performance",
      description: "Track fuel efficiency, route optimization, and operational metrics",
      icon: Ship,
      category: "operational"
    },
    {
      name: "Financial Overview",
      description: "Monitor expenses, revenue, and budget allocation",
      icon: DollarSign,
      category: "financial"
    },
    {
      name: "Crew Analytics",
      description: "Analyze staff performance, attendance, and productivity",
      icon: Users,
      category: "hr"
    },
    {
      name: "Maintenance Trends",
      description: "Track maintenance schedules, costs, and equipment health",
      icon: Activity,
      category: "maintenance"
    }
  ];

  const quickStats = [
    {
      title: "Reports Generated",
      value: "127",
      change: "+18%",
      icon: FileText
    },
    {
      title: "Data Points Analyzed",
      value: "24.5K",
      change: "+22%",
      icon: BarChart3
    },
    {
      title: "Avg Generation Time",
      value: "2.3 min",
      change: "-15%",
      icon: Clock
    },
    {
      title: "Storage Used",
      value: "156 MB",
      change: "+8%",
      icon: PieChart
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operational': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Reports & Analytics</h1>
          <p className="text-maritime-anchor">Generate insights from your maritime operations</p>
        </div>
        <Button className="bg-maritime-blue hover:bg-maritime-ocean">
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-maritime-ocean" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-maritime-navy">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">{stat.change}</span>
                <span className="text-maritime-anchor">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Report Templates</CardTitle>
          <CardDescription>Quick start templates for common reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => (
              <div key={index} className="p-4 border border-maritime-foam rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <template.icon className="h-6 w-6 text-maritime-ocean" />
                  <span className="font-medium text-maritime-navy">{template.name}</span>
                </div>
                <p className="text-sm text-maritime-anchor mb-3">{template.description}</p>
                <Button size="sm" variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maritime-anchor h-4 w-4" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-maritime-foam rounded-lg focus:ring-2 focus:ring-maritime-blue focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            className="bg-maritime-blue hover:bg-maritime-ocean"
          >
            All Types
          </Button>
          <Button
            variant={filterType === 'operational' ? 'default' : 'outline'}
            onClick={() => setFilterType('operational')}
          >
            Operational
          </Button>
          <Button
            variant={filterType === 'financial' ? 'default' : 'outline'}
            onClick={() => setFilterType('financial')}
          >
            Financial
          </Button>
          <Button
            variant={filterType === 'hr' ? 'default' : 'outline'}
            onClick={() => setFilterType('hr')}
          >
            HR
          </Button>
        </div>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Generated Reports</CardTitle>
          <CardDescription>Recently created reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-maritime-ocean" />
                    <div>
                      <div className="font-medium text-maritime-navy">{report.name}</div>
                      <div className="text-sm text-maritime-anchor">{report.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <span className="text-xs text-maritime-anchor">
                      Generated: {report.lastGenerated}
                    </span>
                    <span className="text-xs text-maritime-anchor">
                      Size: {report.size}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
