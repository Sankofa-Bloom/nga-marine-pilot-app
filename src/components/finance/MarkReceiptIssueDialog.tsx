
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';

interface MarkReceiptIssueDialogProps {
  receiptId: string;
  receiptNumber: string;
}

export const MarkReceiptIssueDialog: React.FC<MarkReceiptIssueDialogProps> = ({ receiptId, receiptNumber }) => {
  const [open, setOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const { markReceiptIssue, loading } = useFinance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await markReceiptIssue(receiptId, issueDescription);
    
    if (success) {
      setOpen(false);
      setIssueDescription('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Mark Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Mark Receipt Issue</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Mark receipt <strong>{receiptNumber}</strong> as having an issue. This will not delete the receipt but will flag it for review.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="issue_description">Issue Description</Label>
              <Textarea
                id="issue_description"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the issue with this receipt..."
                required
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                type="submit" 
                disabled={loading || !issueDescription.trim()}
                variant="destructive"
                className="flex-1"
              >
                {loading ? 'Marking...' : 'Mark as Issue'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
