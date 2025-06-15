import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Bell,
  Database,
  Mail,
  Palette,
  Globe,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  Users,
  Lock
} from 'lucide-react';
import { useSystemUsers } from "@/hooks/useSystemUsers";
import AddUserDialog from "@/components/settings/AddUserDialog";
import EditUserDialog from "@/components/settings/EditUserDialog";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  // User Management states/hooks
  const { users: systemUsers, loading: usersLoading, addUser, editUser } = useSystemUsers();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const settingsTabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'backup', label: 'Backup & Export', icon: Database }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>Basic system configuration and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-maritime-navy mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="NGA Marine Services"
                      className="w-full p-2 border border-maritime-foam rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-maritime-navy mb-1">
                      System Version
                    </label>
                    <input
                      type="text"
                      defaultValue="v2.1.4"
                      disabled
                      className="w-full p-2 border border-maritime-foam rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-maritime-navy mb-1">
                      Time Zone
                    </label>
                    <select className="w-full p-2 border border-maritime-foam rounded-lg">
                      <option>Africa/Douala (WAT)</option>
                      <option>UTC</option>
                      <option>Europe/London</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-maritime-navy mb-1">
                      Language
                    </label>
                    <select className="w-full p-2 border border-maritime-foam rounded-lg">
                      <option>English</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
                <Button className="bg-maritime-blue hover:bg-maritime-ocean">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-maritime-navy mb-1">
                      Theme
                    </label>
                    <select className="w-full p-2 border border-maritime-foam rounded-lg">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-maritime-navy mb-1">
                      Color Scheme
                    </label>
                    <select className="w-full p-2 border border-maritime-foam rounded-lg">
                      <option>Maritime Blue</option>
                      <option>Ocean Green</option>
                      <option>Deep Navy</option>
                    </select>
                  </div>
                </div>
                <Button variant="outline">
                  <Palette className="h-4 w-4 mr-2" />
                  Customize Colors
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage system users and permissions</CardDescription>
                  </div>
                  <Button className="bg-maritime-blue hover:bg-maritime-ocean" onClick={() => setAddDialogOpen(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usersLoading && (
                    <div className="text-maritime-anchor text-sm">Loading users...</div>
                  )}
                  {systemUsers.length === 0 && !usersLoading && (
                    <div className="text-maritime-anchor">No users found.</div>
                  )}
                  {systemUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-maritime-blue rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-maritime-navy">{user.name || user.email}</div>
                          <div className="text-sm text-maritime-anchor">{user.email}</div>
                          {user.lastLogin && (
                            <div className="text-xs text-maritime-anchor">Last login: {user.lastLogin}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <AddUserDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={addUser} loading={usersLoading} />
            <EditUserDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} user={selectedUser} onEdit={editUser} loading={usersLoading} />
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security policies and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">Two-Factor Authentication</div>
                      <div className="text-sm text-maritime-anchor">Require 2FA for all admin users</div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">Session Timeout</div>
                      <div className="text-sm text-maritime-anchor">Auto-logout after inactivity</div>
                    </div>
                    <select className="p-2 border border-maritime-foam rounded-lg">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>8 hours</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">Password Policy</div>
                      <div className="text-sm text-maritime-anchor">Minimum 8 characters, mixed case</div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage external service integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-maritime-foam rounded-lg">
                    <div>
                      <div className="font-medium text-maritime-navy">Weather API</div>
                      <div className="text-sm text-maritime-anchor">For route planning and weather updates</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-maritime-foam rounded-lg">
                    <div>
                      <div className="font-medium text-maritime-navy">Port Information API</div>
                      <div className="text-sm text-maritime-anchor">Real-time port data and schedules</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Needs Update</Badge>
                  </div>
                </div>
                <Button className="bg-maritime-blue hover:bg-maritime-ocean">
                  <Key className="h-4 w-4 mr-2" />
                  Add API Key
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how and when to receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">Email Notifications</div>
                      <div className="text-sm text-maritime-anchor">Receive important updates via email</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">SMS Alerts</div>
                      <div className="text-sm text-maritime-anchor">Critical alerts via SMS</div>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">Maintenance Reminders</div>
                      <div className="text-sm text-maritime-anchor">Scheduled maintenance notifications</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-maritime-navy">Budget Alerts</div>
                      <div className="text-sm text-maritime-anchor">When expenses exceed thresholds</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Connect with external services and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-maritime-foam rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-maritime-navy">Accounting Software</div>
                      <Badge className="bg-gray-100 text-gray-800">Not Connected</Badge>
                    </div>
                    <p className="text-sm text-maritime-anchor mb-3">Sync financial data with QuickBooks or similar</p>
                    <Button size="sm" variant="outline" className="w-full">Connect</Button>
                  </div>
                  <div className="p-4 border border-maritime-foam rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-maritime-navy">Weather Services</div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <p className="text-sm text-maritime-anchor mb-3">Real-time weather data for route planning</p>
                    <Button size="sm" variant="outline" className="w-full">Configure</Button>
                  </div>
                  <div className="p-4 border border-maritime-foam rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-maritime-navy">GPS Tracking</div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <p className="text-sm text-maritime-anchor mb-3">Live vessel tracking and positioning</p>
                    <Button size="sm" variant="outline" className="w-full">Manage</Button>
                  </div>
                  <div className="p-4 border border-maritime-foam rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-maritime-navy">Document Storage</div>
                      <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>
                    </div>
                    <p className="text-sm text-maritime-anchor mb-3">Cloud storage for document backup</p>
                    <Button size="sm" variant="outline" className="w-full">Setup</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Backup & Export</CardTitle>
                <CardDescription>Manage data backups and exports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                    <div>
                      <div className="font-medium text-maritime-navy">Automatic Backups</div>
                      <div className="text-sm text-maritime-anchor">Daily backup at 2:00 AM</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                    <div>
                      <div className="font-medium text-maritime-navy">Last Backup</div>
                      <div className="text-sm text-maritime-anchor">January 12, 2024 - 02:15 AM</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button className="bg-maritime-blue hover:bg-maritime-ocean">
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore Backup
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Export data for external analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Download className="h-6 w-6" />
                      <span>Export Employee Data</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Download className="h-6 w-6" />
                      <span>Export Financial Records</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Download className="h-6 w-6" />
                      <span>Export Vessel Data</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col space-y-2">
                      <Download className="h-6 w-6" />
                      <span>Export All Data</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">System Settings</h1>
          <p className="text-maritime-anchor">Configure and manage system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-maritime-foam transition-colors ${
                      activeTab === tab.id ? 'bg-maritime-foam border-r-2 border-maritime-blue text-maritime-blue' : 'text-maritime-navy'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
