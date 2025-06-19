import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
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
  AlertTriangle,
  MoreVertical,
  Link
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDocuments } from '@/hooks/useDocuments';
import { FileUploadDialog } from '@/components/documents/FileUploadDialog';
import { PublicUploadDialog } from '@/components/documents/PublicUploadDialog';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPublicUploadDialogOpen, setIsPublicUploadDialogOpen] = useState(false);

  const { 
    documents, 
    categories, 
    loading, 
    uploadDocument, 
    downloadDocument, 
    viewDocument 
  } = useDocuments();

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

  const handleShareDocument = (doc: any) => {
    const shareUrl = `${window.location.origin}/documents/share/${doc.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(`Share link for "${doc.name}" copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy share link');
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'legal': return FileText;
      case 'safety': return AlertTriangle;
      case 'insurance': return Lock;
      case 'training': return User;
      case 'maintenance': return File;
      case 'financial': return FileText;
      default: return Folder;
    }
  };

  const getCategoryCount = (categoryName: string) => {
    return documents.filter(doc => doc.category === categoryName).length;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.original_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totalSize = documents.reduce((acc, doc) => acc + doc.size, 0);
  const expiringDocuments = documents.filter(doc => {
    if (!doc.expiry_date) return false;
    const expiryDate = new Date(doc.expiry_date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maritime-blue mx-auto mb-4"></div>
          <p className="text-maritime-anchor">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Document Management</h1>
          <p className="text-maritime-anchor">Organize and manage your digital documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setIsUploadDialogOpen(true)}
            className="bg-maritime-blue hover:bg-maritime-ocean w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <Button 
            onClick={() => setIsPublicUploadDialogOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link className="h-4 w-4 mr-2" />
            Generate Upload Link
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
            <div className="text-2xl font-bold text-maritime-navy">{documents.length}</div>
            <p className="text-xs text-maritime-anchor">documents stored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Folder className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">{formatFileSize(totalSize)}</div>
            <p className="text-xs text-maritime-anchor">total storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">{expiringDocuments}</div>
            <p className="text-xs text-maritime-anchor">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Share className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">{categories.length}</div>
            <p className="text-xs text-maritime-anchor">available categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Document Categories</CardTitle>
          <CardDescription>Organize documents by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              const count = getCategoryCount(category.name);
              return (
                <div 
                  key={category.id} 
                  className="p-4 border border-maritime-foam rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setFilterCategory(category.name)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <IconComponent className="h-8 w-8 text-maritime-ocean" />
                    <span className="text-sm font-medium text-maritime-navy text-center capitalize">{category.name}</span>
                    <span className="text-xs text-maritime-anchor">{count} files</span>
                  </div>
                </div>
              );
            })}
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('all')}
            className={filterCategory === 'all' ? 'bg-maritime-blue hover:bg-maritime-ocean' : ''}
            size="sm"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filterCategory === category.name ? 'default' : 'outline'}
              onClick={() => setFilterCategory(category.name)}
              className={filterCategory === category.name ? 'bg-maritime-blue hover:bg-maritime-ocean' : ''}
              size="sm"
            >
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Recent Documents</CardTitle>
          <CardDescription>Recently uploaded and modified documents</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border border-maritime-foam rounded-lg space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {getFileIcon(doc.type)}
                      {doc.is_confidential && <Lock className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-maritime-navy truncate">{doc.name}</div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-maritime-anchor">
                        <span>Size: {formatFileSize(doc.size)}</span>
                        <span>Uploaded: {formatDate(doc.uploaded_at)}</span>
                        {doc.expiry_date && (
                          <span>Expires: {formatDate(doc.expiry_date)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <Badge className={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Desktop Actions */}
                  <div className="hidden lg:flex space-x-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => viewDocument(doc)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadDocument(doc)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleShareDocument(doc)}>
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>

                  {/* Mobile Actions - Dropdown */}
                  <div className="lg:hidden flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewDocument(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadDocument(doc)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareDocument(doc)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialogs */}
      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        categories={categories}
        onUpload={uploadDocument}
      />

      <PublicUploadDialog
        open={isPublicUploadDialogOpen}
        onOpenChange={setIsPublicUploadDialogOpen}
        categories={categories}
      />
    </div>
  );
};

export default Documents;
