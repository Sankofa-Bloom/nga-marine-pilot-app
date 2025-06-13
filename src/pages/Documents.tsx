
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  Search, 
  Upload,
  Download,
  Share,
  Eye,
  Folder,
  File,
  Calendar,
  User,
  Lock,
  AlertTriangle
} from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const documents = [
    {
      id: 1,
      name: "Vessel Registration - MV Cameroon Pride",
      type: "certificate",
      category: "legal",
      size: "2.1 MB",
      uploadDate: "2024-01-10",
      expiryDate: "2025-12-31",
      uploadedBy: "Marie Douala",
      status: "active",
      isConfidential: false
    },
    {
      id: 2,
      name: "Safety Inspection Report Q4 2023",
      type: "report",
      category: "safety",
      size: "5.8 MB",
      uploadDate: "2024-01-08",
      expiryDate: null,
      uploadedBy: "Jean Paul Mbarga",
      status: "active",
      isConfidential: false
    },
    {
      id: 3,
      name: "Insurance Policy - Fleet Coverage",
      type: "policy",
      category: "insurance",
      size: "1.4 MB",
      uploadDate: "2024-01-05",
      expiryDate: "2024-12-31",
      uploadedBy: "Admin",
      status: "expiring",
      isConfidential: true
    },
    {
      id: 4,
      name: "Crew Training Certificates",
      type: "certificate",
      category: "training",
      size: "3.2 MB",
      uploadDate: "2024-01-12",
      expiryDate: "2026-01-12",
      uploadedBy: "HR Department",
      status: "active",
      isConfidential: false
    }
  ];

  const folders = [
    { name: "Legal Documents", count: 24, icon: FileText },
    { name: "Safety Reports", count: 18, icon: AlertTriangle },
    { name: "Insurance", count: 12, icon: Lock },
    { name: "Training Records", count: 35, icon: User },
    { name: "Maintenance Logs", count: 45, icon: File },
    { name: "Financial Records", count: 28, icon: FileText }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal': return 'bg-blue-100 text-blue-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'insurance': return 'bg-purple-100 text-purple-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'report': return <FileText className="h-5 w-5 text-green-600" />;
      case 'policy': return <FileText className="h-5 w-5 text-purple-600" />;
      default: return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Document Management</h1>
          <p className="text-maritime-anchor">Organize and manage your digital documents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <Button className="bg-maritime-blue hover:bg-maritime-ocean">
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-maritime-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">1,247</div>
            <p className="text-xs text-maritime-anchor">+23 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Folder className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">2.8 GB</div>
            <p className="text-xs text-maritime-anchor">of 10 GB limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">7</div>
            <p className="text-xs text-maritime-anchor">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Documents</CardTitle>
            <Share className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">184</div>
            <p className="text-xs text-maritime-anchor">Actively shared</p>
          </CardContent>
        </Card>
      </div>

      {/* Folders Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Document Categories</CardTitle>
          <CardDescription>Organize documents by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {folders.map((folder, index) => (
              <div key={index} className="p-4 border border-maritime-foam rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <folder.icon className="h-8 w-8 text-maritime-ocean" />
                  <span className="text-sm font-medium text-maritime-navy text-center">{folder.name}</span>
                  <span className="text-xs text-maritime-anchor">{folder.count} files</span>
                </div>
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
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-maritime-foam rounded-lg focus:ring-2 focus:ring-maritime-blue focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('all')}
            className="bg-maritime-blue hover:bg-maritime-ocean"
          >
            All Categories
          </Button>
          <Button
            variant={filterCategory === 'legal' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('legal')}
          >
            Legal
          </Button>
          <Button
            variant={filterCategory === 'safety' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('safety')}
          >
            Safety
          </Button>
          <Button
            variant={filterCategory === 'training' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('training')}
          >
            Training
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Recent Documents</CardTitle>
          <CardDescription>Recently uploaded and modified documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(doc.type)}
                    {doc.isConfidential && <Lock className="h-4 w-4 text-red-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-maritime-navy">{doc.name}</div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-maritime-anchor">
                      <span>Size: {doc.size}</span>
                      <span>Uploaded: {doc.uploadDate}</span>
                      <span>By: {doc.uploadedBy}</span>
                      {doc.expiryDate && (
                        <span>Expires: {doc.expiryDate}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getCategoryColor(doc.category)}>
                      {doc.category}
                    </Badge>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
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

export default Documents;
