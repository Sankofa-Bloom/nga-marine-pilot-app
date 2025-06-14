
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Ship, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  AlertTriangle,
  TrendingUp,
  FileText,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Employees",
      value: "127",
      icon: Users,
      change: "+12%",
      route: "/employees"
    },
    {
      title: "Vessels",
      value: "18",
      icon: Ship,
      change: "+2",
      route: "/vessels"
    },
    {
      title: "Tasks",
      value: "34",
      icon: CheckSquare,
      change: "-8%",
      route: "/tasks"
    },
    {
      title: "Budget",
      value: "$1.2M",
      icon: DollarSign,
      change: "+5.2%",
      route: "/finance"
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New employee onboarded",
      employee: "Jean Paul Mbarga",
      time: "2h ago",
      type: "employee"
    },
    {
      id: 2,
      action: "Vessel maintenance completed",
      employee: "MV Ocean Star",
      time: "4h ago",
      type: "vessel"
    },
    {
      id: 3,
      action: "Expense report submitted",
      employee: "Marie Douala",
      time: "6h ago",
      type: "finance"
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Vessel inspection",
      vessel: "MV Cameroon Pride",
      due: "Today, 2:00 PM",
      priority: "high"
    },
    {
      id: 2,
      title: "Certification renewal",
      vessel: "5 crew members",
      due: "Tomorrow",
      priority: "medium"
    },
  ];

  const quickActions = [
    { title: "Add Employee", icon: Users, route: "/employees", color: "bg-blue-500" },
    { title: "Schedule Crew", icon: Calendar, route: "/scheduling", color: "bg-green-500" },
    { title: "Fleet Status", icon: Ship, route: "/vessels", color: "bg-purple-500" },
    { title: "New Task", icon: CheckSquare, route: "/tasks", color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-maritime-blue to-maritime-ocean text-white rounded-xl p-6">
        <h1 className="text-xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-maritime-foam text-sm">
          Here's your maritime operations overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(stat.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-maritime-ocean" />
                <TrendingUp className="h-3 w-3 text-green-600" />
              </div>
              <div className="text-xl font-bold text-maritime-navy">{stat.value}</div>
              <div className="text-xs text-maritime-anchor">{stat.title}</div>
              <div className="text-xs text-green-600 font-medium">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-maritime-navy">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => navigate(action.route)}
                className="flex flex-col items-center p-4 h-auto bg-white hover:bg-maritime-foam border border-maritime-foam"
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-maritime-navy">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-maritime-navy">Recent Activities</CardTitle>
            <Button variant="ghost" size="sm" className="text-maritime-anchor">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-maritime-foam rounded-lg">
              <div className="w-2 h-2 bg-maritime-ocean rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-maritime-navy truncate">{activity.action}</p>
                <p className="text-xs text-maritime-anchor">{activity.employee}</p>
              </div>
              <span className="text-xs text-maritime-anchor flex-shrink-0">{activity.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-maritime-navy">Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tasks')} className="text-maritime-anchor">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 border border-maritime-foam rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-maritime-navy truncate">{task.title}</p>
                <p className="text-xs text-maritime-anchor">{task.vessel}</p>
                <p className="text-xs text-maritime-anchor">{task.due}</p>
              </div>
              <Badge 
                variant={task.priority === 'high' ? 'destructive' : 'default'}
                className={task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
              >
                {task.priority}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
