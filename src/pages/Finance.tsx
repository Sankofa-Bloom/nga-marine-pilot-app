
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Search, 
  TrendingUp,
  TrendingDown,
  FileText,
  PieChart,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useFinance } from '@/hooks/useFinance';
import { CreateTransactionDialog } from '@/components/finance/CreateTransactionDialog';
import { CreateInvoiceDialog } from '@/components/finance/CreateInvoiceDialog';
import { CreateReceiptDialog } from '@/components/finance/CreateReceiptDialog';
import { MarkReceiptIssueDialog } from '@/components/finance/MarkReceiptIssueDialog';

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  
  const { 
    transactions, 
    invoices, 
    receipts, 
    departments, 
    updateTransactionStatus,
    loading
  } = useFinance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': case 'active': return 'bg-green-100 text-green-800';
      case 'approved': case 'sent': return 'bg-blue-100 text-blue-800';
      case 'pending': case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': case 'cancelled': case 'overdue': return 'bg-red-100 text-red-800';
      case 'has_issue': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': case 'draft': return <Clock className="h-4 w-4" />;
      case 'rejected': case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'has_issue': case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getDepartmentBudgetData = () => {
    return departments.map(dept => {
      const spent = receipts
        .filter(receipt => receipt.department_id === dept.id && receipt.status === 'active')
        .reduce((sum, receipt) => sum + receipt.amount, 0);
      
      const remaining = dept.budget_allocated - spent;
      const percentage = (spent / dept.budget_allocated) * 100;
      
      return {
        ...dept,
        spent,
        remaining,
        percentage: Math.min(percentage, 100)
      };
    });
  };

  const getTotalStats = () => {
    const totalBudget = departments.reduce((sum, dept) => sum + dept.budget_allocated, 0);
    const totalSpent = receipts
      .filter(receipt => receipt.status === 'active')
      .reduce((sum, receipt) => sum + receipt.amount, 0);
    const totalIncome = transactions
      .filter(tx => tx.type === 'income' && tx.status === 'paid')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const pendingApprovals = transactions
      .filter(tx => tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return { totalBudget, totalSpent, totalIncome, pendingApprovals };
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.transaction_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || tx.department_id === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = receipt.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receipt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || receipt.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || receipt.department_id === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = getTotalStats();
  const budgetData = getDepartmentBudgetData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Finance Management</h1>
          <p className="text-maritime-anchor">Comprehensive financial management system</p>
        </div>
        <div className="flex space-x-2">
          <CreateReceiptDialog />
          <CreateInvoiceDialog />
          <CreateTransactionDialog />
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-maritime-ocean" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">
              {formatCurrency(stats.totalBudget)}
            </div>
            <p className="text-xs text-maritime-anchor">Annual allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">
              {formatCurrency(stats.totalSpent)}
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-maritime-anchor">
                {((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of budget
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-maritime-anchor">Received payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">
              {formatCurrency(stats.pendingApprovals)}
            </div>
            <p className="text-xs text-maritime-anchor">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Department Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Department Budget Overview</CardTitle>
          <CardDescription>Budget allocation and spending by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetData.map((dept) => (
              <div key={dept.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-maritime-navy">{dept.name}</span>
                  <span className="text-sm text-maritime-anchor">
                    {dept.percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={dept.percentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-maritime-anchor">
                    Spent: {formatCurrency(dept.spent)}
                  </span>
                  <span className="text-maritime-navy">
                    Budget: {formatCurrency(dept.budget_allocated)}
                  </span>
                </div>
                {dept.remaining < 0 && (
                  <div className="text-xs text-red-600">
                    Over budget by {formatCurrency(Math.abs(dept.remaining))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-maritime-anchor h-4 w-4" />
          <Input
            type="text"
            placeholder="Search transactions, invoices, receipts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="has_issue">Has Issue</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="text-maritime-navy">Financial Transactions</CardTitle>
              <CardDescription>View and manage all financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-maritime-navy">
                          {transaction.transaction_number}
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(transaction.status)}
                            <span>{transaction.status}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline">
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-maritime-anchor mt-1">
                        {transaction.description}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-maritime-anchor">
                        <span>{transaction.departments?.name}</span>
                        <span>{transaction.category}</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        {transaction.vessel && <span>Vessel: {transaction.vessel}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                      {transaction.status === 'pending' && (
                        <div className="flex space-x-1 mt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTransactionStatus(transaction.id, 'approved')}
                            disabled={loading}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTransactionStatus(transaction.id, 'rejected')}
                            disabled={loading}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle className="text-maritime-navy">Invoices</CardTitle>
              <CardDescription>Manage client invoices and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-maritime-navy">
                          {invoice.invoice_number}
                        </div>
                        <Badge className={getStatusColor(invoice.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(invoice.status)}
                            <span>{invoice.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="text-sm text-maritime-anchor mt-1">
                        Client: {invoice.client_name}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-maritime-anchor">
                        <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                        <span>Items: {invoice.invoice_line_items?.length || 0}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-maritime-navy">
                        {formatCurrency(invoice.total_amount)}
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts">
          <Card>
            <CardHeader>
              <CardTitle className="text-maritime-navy">Receipts</CardTitle>
              <CardDescription>Track and manage expense receipts by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-maritime-navy">
                          {receipt.receipt_number}
                        </div>
                        <Badge className={getStatusColor(receipt.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(receipt.status)}
                            <span>{receipt.status === 'has_issue' ? 'Has Issue' : 'Active'}</span>
                          </div>
                        </Badge>
                        <Badge variant="outline">
                          {receipt.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-maritime-anchor mt-1">
                        Vendor: {receipt.vendor_name} - {receipt.description}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-maritime-anchor">
                        <span>{receipt.departments?.name}</span>
                        <span>{receipt.payment_method.replace('_', ' ')}</span>
                        <span>{new Date(receipt.receipt_date).toLocaleDateString()}</span>
                      </div>
                      {receipt.status === 'has_issue' && receipt.issue_description && (
                        <div className="text-xs text-red-600 mt-1">
                          Issue: {receipt.issue_description}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-maritime-navy">
                        {formatCurrency(receipt.amount)}
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {receipt.status === 'active' && (
                          <MarkReceiptIssueDialog 
                            receiptId={receipt.id} 
                            receiptNumber={receipt.receipt_number}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
