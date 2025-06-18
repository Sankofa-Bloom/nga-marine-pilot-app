
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Document {
  id: string;
  name: string;
  original_name: string;
  type: string;
  category: string;
  size: number;
  file_path: string;
  uploaded_by: string;
  uploaded_at: string;
  expiry_date: string | null;
  status: string;
  is_confidential: boolean;
  mime_type: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('document_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const uploadDocument = async (file: File, category: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Determine file type based on extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      let type = 'document';
      if (['pdf'].includes(extension || '')) type = 'policy';
      if (['doc', 'docx'].includes(extension || '')) type = 'report';
      if (['jpg', 'jpeg', 'png'].includes(extension || '')) type = 'certificate';

      // Create file path
      const fileName = `${user.id}/${Date.now()}-${file.name}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Insert document metadata
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for display
          original_name: file.name,
          type,
          category,
          size: file.size,
          file_path: fileName,
          uploaded_by: user.id,
          mime_type: file.type,
          is_confidential: category === 'insurance' || category === 'financial'
        });

      if (insertError) throw insertError;

      toast.success(`${file.name} uploaded successfully`);
      fetchDocuments(); // Refresh documents list
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      throw error;
    }
  };

  const downloadDocument = async (doc: Document) => {
    try {
      const url = await getDocumentUrl(doc.file_path);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${doc.name}...`);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(`Failed to download ${doc.name}`);
    }
  };

  const viewDocument = async (doc: Document) => {
    try {
      const url = await getDocumentUrl(doc.file_path);
      window.open(url, '_blank');
      toast.success(`Opening ${doc.name}...`);
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error(`Failed to open ${doc.name}`);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDocuments(), fetchCategories()]);
      setLoading(false);
    };

    loadData();

    // Set up realtime subscription
    const subscription = supabase
      .channel('documents-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'documents'
      }, () => {
        fetchDocuments();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    documents,
    categories,
    loading,
    uploadDocument,
    downloadDocument,
    viewDocument,
    fetchDocuments
  };
};
