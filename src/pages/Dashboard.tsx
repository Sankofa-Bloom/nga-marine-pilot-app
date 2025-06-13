
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Ship, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Employees",
      value: "127",
      icon: Users,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Active Vessels",
      value: "18",
      icon: Ship,
      change: "+2",
      changeType: "positive" as const
    },
    {
      title: "Pending Tasks",
      value: "34",
      icon: CheckSquare,
      change: "-8%",
      changeType: "positive" as const
    },
    {
      title: "Monthly Budget",
      value: "$1.2M",
      icon: DollarSign,
      change: "+5.2%",
      changeType: "positive" as const
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New employee onboarded",
      employee: "Jean Paul Mbarga",
      time: "2 hours ago",
      type: "employee"
    },
    {
      id: 2,
      action: "Vessel maintenance completed",
      employee: "MV Ocean Star",
      time: "4 hours ago",
      type: "vessel"
    },
    {
      id: 3,
      action: "Expense report submitted",
      employee: "Marie Douala",
      time: "6 hours ago",
      type: "finance"
    },
    {
      id: 4,
      action: "Schedule updated",
      employee: "Port Operations Team",
      time: "1 day ago",
      type: "schedule"
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Vessel inspection - MV Cameroon Pride",
      due: "Today, 2:00 PM",
      priority: "high"
    },
    {
      id: 2,
      title: "Employee certification renewal - 5 crew members",
      due: "Tomorrow, 9:00 AM",
      priority: "medium"
    },
    {
      id: 3,
      title: "Monthly budget review meeting",
      due: "Dec 15, 10:00 AM",
      priority: "low"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-maritime-blue to-maritime-ocean text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-maritime-foam">
          Here's what's happening with your maritime operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-maritime-anchor">
                {stat.title}
              </CardTitle>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-maritime-navy">Recent Activities</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-maritime-foam rounded-lg">
                <div className="w-2 h-2 bg-maritime-ocean rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-maritime-navy">{activity.action}</p>
                  <p className="text-xs text-maritime-anchor">{activity.employee}</p>
                </div>
                <span className="text-xs text-maritime-anchor">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-maritime-navy">Upcoming Tasks</CardTitle>
            <CardDescription>Important tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border border-maritime-foam rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-maritime-navy">{task.title}</p>
                  <p className="text-xs text-maritime-anchor">{task.due}</p>
                </div>
                <Badge 
                  variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                  className={task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-maritime-foam rounded-lg hover:bg-maritime-wave hover:text-white transition-all">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Add Employee</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-maritime-foam rounded-lg hover:bg-maritime-wave hover:text-white transition-all">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Schedule Crew</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-maritime-foam rounded-lg hover:bg-maritime-wave hover:text-white transition-all">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Create Report</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-maritime-foam rounded-lg hover:bg-maritime-wave hover:text-white transition-all">
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Track Expenses</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
