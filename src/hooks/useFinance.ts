
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  description: string;
  budget_allocated: number;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  transaction_number: string;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  amount: number;
  description: string;
  department_id: string;
  vessel?: string;
  date: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  created_by: string;
  created_at: string;
  updated_at: string;
  departments?: Department;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email?: string;
  client_address?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  invoice_line_items?: LineItem[];
}

interface LineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

interface Receipt {
  id: string;
  receipt_number: string;
  transaction_id?: string;
  department_id: string;
  vendor_name: string;
  amount: number;
  description: string;
  receipt_date: string;
  category: string;
  payment_method: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'check';
  status: 'active' | 'has_issue';
  issue_description?: string;
  file_path?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  departments?: Department;
}

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDepartments();
      fetchTransactions();
      fetchInvoices();
      fetchReceipts();
    }
  }, [user]);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (data && !error) {
      setDepartments(data);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        departments (*)
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setTransactions(data);
    }
  };

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_line_items (*)
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setInvoices(data);
    }
  };

  const fetchReceipts = async () => {
    const { data, error } = await supabase
      .from('receipts')
      .select(`
        *,
        departments (*)
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setReceipts(data);
    }
  };

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'transaction_number' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transactionData,
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Transaction created successfully');
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'created_by' | 'invoice_line_items'>, lineItems: Omit<LineItem, 'id' | 'invoice_id' | 'created_at'>[]) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          created_by: user.id
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      if (lineItems.length > 0) {
        const { error: lineItemsError } = await supabase
          .from('invoice_line_items')
          .insert(
            lineItems.map(item => ({
              ...item,
              invoice_id: invoice.id
            }))
          );

        if (lineItemsError) throw lineItemsError;
      }

      toast.success('Invoice created successfully');
      await fetchInvoices();
      return true;
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createReceipt = async (receiptData: Omit<Receipt, 'id' | 'receipt_number' | 'created_at' | 'updated_at' | 'created_by'>) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('receipts')
        .insert({
          ...receiptData,
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Receipt created successfully');
      await fetchReceipts();
      return true;
    } catch (error) {
      console.error('Error creating receipt:', error);
      toast.error('Failed to create receipt');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markReceiptIssue = async (receiptId: string, issueDescription: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('receipts')
        .update({
          status: 'has_issue',
          issue_description: issueDescription
        })
        .eq('id', receiptId);

      if (error) throw error;

      toast.success('Receipt marked as having an issue');
      await fetchReceipts();
      return true;
    } catch (error) {
      console.error('Error marking receipt issue:', error);
      toast.error('Failed to mark receipt issue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: Transaction['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({ status })
        .eq('id', transactionId);

      if (error) throw error;

      toast.success('Transaction status updated');
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      toast.error('Failed to update transaction status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    invoices,
    receipts,
    departments,
    loading,
    createTransaction,
    createInvoice,
    createReceipt,
    markReceiptIssue,
    updateTransactionStatus,
    fetchTransactions,
    fetchInvoices,
    fetchReceipts
  };
};
