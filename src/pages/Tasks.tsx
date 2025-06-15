import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Wrench,
  FileText,
  Ship
} from 'lucide-react';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const tasks = [
    {
      id: 1,
      title: "Engine Maintenance - MV Cameroon Pride",
      description: "Complete routine engine inspection and oil change",
      assignee: "Jean Paul Mbarga",
      vessel: "MV Cameroon Pride",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-15",
      progress: 65,
      category: "maintenance"
    },
    {
      id: 2,
      title: "Safety Equipment Inspection",
      description: "Inspect life jackets, fire extinguishers, and emergency equipment",
      assignee: "Marie Douala",
      vessel: "MV Ocean Star",
      priority: "medium",
      status: "pending",
      dueDate: "2024-01-20",
      progress: 0,
      category: "safety"
    },
    {
      id: 3,
      title: "Cargo Hold Cleaning",
      description: "Deep clean cargo holds after grain transport",
      assignee: "Port Operations Team",
      vessel: "MV Atlantic Wave",
      priority: "low",
      status: "completed",
      dueDate: "2024-01-10",
      progress: 100,
      category: "cleaning"
    },
    {
      id: 4,
      title: "Navigation System Update",
      description: "Update GPS and radar systems software",
      assignee: "Technical Team",
      vessel: "MV Coastal Guardian",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-18",
      progress: 0,
      category: "technical"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.vessel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  // Handlers to demonstrate button functionality (please link to real modals/dialogs later)
  const handleCreateTask = () => {
    toast({
      title: "Create Task",
      description: "Create Task functionality clicked",
    });
  };

  const handleViewDetails = (taskId: number) => {
    toast({
      title: "View Details",
      description: `View Details for task #${taskId}`,
    });
  };

  const handleAssign = (taskId: number) => {
    toast({
      title: "Assign Task", 
      description: `Assign clicked for task #${taskId}`,
    });
  };

  const handleUpdate = (taskId: number) => {
    toast({
      title: "Update Task",
      description: `Update clicked for task #${taskId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Task Management</h1>
          <p className="text-maritime-anchor">Track work orders and assignments</p>
        </div>
        <Button
          className="bg-maritime-blue text-white hover:bg-maritime-ocean"
          onClick={handleCreateTask}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-maritime-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">47</div>
            <p className="text-xs text-maritime-anchor">+5 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">12</div>
            <p className="text-xs text-maritime-anchor">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">28</div>
            <p className="text-xs text-maritime-anchor">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">3</div>
            <p className="text-xs text-maritime-anchor">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maritime-anchor h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-maritime-foam rounded-lg focus:ring-2 focus:ring-maritime-blue focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterPriority === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterPriority('all')}
            className="bg-maritime-blue text-white hover:bg-maritime-ocean"
          >
            All Priority
          </Button>
          <Button
            variant={filterPriority === 'high' ? 'default' : 'outline'}
            onClick={() => setFilterPriority('high')}
            className={filterPriority === 'high' ? 'bg-maritime-blue text-white hover:bg-maritime-ocean' : 'bg-maritime-foam text-maritime-navy hover:bg-sky-200'}
          >
            High
          </Button>
          <Button
            variant={filterPriority === 'medium' ? 'default' : 'outline'}
            onClick={() => setFilterPriority('medium')}
            className={filterPriority === 'medium' ? 'bg-maritime-blue text-white hover:bg-maritime-ocean' : 'bg-maritime-foam text-maritime-navy hover:bg-sky-200'}
          >
            Medium
          </Button>
          <Button
            variant={filterPriority === 'low' ? 'default' : 'outline'}
            onClick={() => setFilterPriority('low')}
            className={filterPriority === 'low' ? 'bg-maritime-blue text-white hover:bg-maritime-ocean' : 'bg-maritime-foam text-maritime-navy hover:bg-sky-200'}
          >
            Low
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(task.status)}
                    <CardTitle className="text-maritime-navy">{task.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">{task.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">{task.assignee}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ship className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">{task.vessel}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-maritime-anchor" />
                  <span className="text-maritime-navy">Due: {task.dueDate}</span>
                </div>
              </div>

              {task.status === 'in-progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-maritime-anchor">Progress</span>
                    <span className="text-maritime-navy">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                {/* Use blue maritime background for all primary actions, except 'Cancel' if present */}
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 bg-maritime-blue text-white hover:bg-maritime-ocean"
                  onClick={() => handleViewDetails(task.id)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 bg-maritime-blue text-white hover:bg-maritime-ocean"
                  onClick={() => handleAssign(task.id)}
                >
                  <User className="h-4 w-4 mr-1" />
                  Assign
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 bg-maritime-blue text-white hover:bg-maritime-ocean"
                  onClick={() => handleUpdate(task.id)}
                >
                  <Wrench className="h-4 w-4 mr-1" />
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
