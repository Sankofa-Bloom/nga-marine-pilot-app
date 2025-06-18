
-- Create documents table to store document metadata
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  size BIGINT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date DATE NULL,
  status TEXT NOT NULL DEFAULT 'active',
  is_confidential BOOLEAN NOT NULL DEFAULT false,
  mime_type TEXT NOT NULL
);

-- Create document_categories table for organizing documents
CREATE TABLE public.document_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.document_categories (name, description, icon) VALUES
('legal', 'Legal documents and contracts', 'FileText'),
('safety', 'Safety reports and inspections', 'AlertTriangle'),
('insurance', 'Insurance policies and claims', 'Lock'),
('training', 'Training records and certificates', 'User'),
('maintenance', 'Maintenance logs and reports', 'File'),
('financial', 'Financial records and reports', 'DollarSign');

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Enable RLS on documents table
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents table
CREATE POLICY "Users can view documents they have access to" 
  ON public.documents 
  FOR SELECT 
  USING (true); -- For now, allow all authenticated users to view documents

CREATE POLICY "Users can upload documents" 
  ON public.documents 
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update documents they uploaded" 
  ON public.documents 
  FOR UPDATE 
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete documents they uploaded" 
  ON public.documents 
  FOR DELETE 
  USING (auth.uid() = uploaded_by);

-- Create storage policies for documents bucket
CREATE POLICY "Users can upload documents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view documents" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'documents');

CREATE POLICY "Users can update their documents" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their documents" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for documents table
ALTER TABLE public.documents REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
