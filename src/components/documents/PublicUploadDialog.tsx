
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PublicUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
}

export const PublicUploadDialog: React.FC<PublicUploadDialogProps> = ({
  open,
  onOpenChange,
  categories
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uploadLink, setUploadLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateUploadLink = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    setGenerating(true);
    try {
      // Generate a unique upload token
      const uploadToken = crypto.randomUUID();
      const link = `${window.location.origin}/upload/${uploadToken}?category=${selectedCategory}`;
      
      // Store the upload token in localStorage for demo purposes
      // In production, this would be stored in the database
      const uploadTokens = JSON.parse(localStorage.getItem('upload_tokens') || '{}');
      uploadTokens[uploadToken] = {
        category: selectedCategory,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      localStorage.setItem('upload_tokens', JSON.stringify(uploadTokens));
      
      setUploadLink(link);
      toast.success('Upload link generated successfully!');
    } catch (error) {
      console.error('Error generating upload link:', error);
      toast.error('Failed to generate upload link');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uploadLink);
      setLinkCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const resetDialog = () => {
    setSelectedCategory('');
    setUploadLink('');
    setLinkCopied(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Public Upload Link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium">Document Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!uploadLink ? (
            <Button 
              onClick={generateUploadLink} 
              disabled={!selectedCategory || generating}
              className="w-full"
            >
              {generating ? 'Generating...' : 'Generate Upload Link'}
            </Button>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Shareable Upload Link</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={uploadLink} readOnly className="text-xs" />
                  <Button size="sm" onClick={copyToClipboard} variant="outline">
                    {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Link expires in 24 hours
                </p>
              </div>
              <Button onClick={resetDialog} variant="outline" className="w-full">
                Generate Another Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
