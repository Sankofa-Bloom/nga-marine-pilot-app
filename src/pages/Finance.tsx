
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Plus, 
  Search, 
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  PieChart,
  CreditCard,
  Fuel,
  Users,
  Wrench
} from 'lucide-react';

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const expenses = [
    {
      id: 1,
      description: "Fuel Purchase - MV Cameroon Pride",
      amount: 45000,
      category: "fuel",
      date: "2024-01-12",
      status: "approved",
      vessel: "MV Cameroon Pride"
    },
    {
      id: 2,
      description: "Engine Parts Replacement",
      amount: 12500,
      category: "maintenance",
      date: "2024-01-10",
      status: "pending",
      vessel: "MV Ocean Star"
    },
    {
      id: 3,
      description: "Crew Wages - December 2023",
      amount: 78000,
      category: "payroll",
      date: "2024-01-05",
      status: "paid",
      vessel: "All Vessels"
    },
    {
      id: 4,
      description: "Port Fees - Douala",
      amount: 8900,
      category: "operations",
      date: "2024-01-08",
      status: "approved",
      vessel: "MV Atlantic Wave"
    }
  ];

  const budgetCategories = [
    {
      category: "Fuel",
      budgeted: 150000,
      spent: 98000,
      remaining: 52000,
      icon: Fuel
    },
    {
      category: "Maintenance",
      budgeted: 80000,
      spent: 45000,
      remaining: 35000,
      icon: Wrench
    },
    {
      category: "Payroll",
      budgeted: 200000,
      spent: 156000,
      remaining: 44000,
      icon: Users
    },
    {
      category: "Operations",
      budgeted: 60000,
      spent: 38000,
      remaining: 22000,
      icon: FileText
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fuel': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-purple-100 text-purple-800';
      case 'payroll': return 'bg-green-100 text-green-800';
      case 'operations': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vessel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-maritime-navy">Finance Management</h1>
          <p className="text-maritime-anchor">Track expenses and monitor budgets</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-maritime-blue hover:bg-maritime-ocean">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
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
            <div className="text-2xl font-bold text-maritime-navy">$490K</div>
            <p className="text-xs text-maritime-anchor">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">$337K</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-red-600" />
              <span className="text-red-600">+12%</span>
              <span className="text-maritime-anchor">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <PieChart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">$153K</div>
            <p className="text-xs text-maritime-anchor">31% remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-maritime-navy">$24K</div>
            <p className="text-xs text-maritime-anchor">7 requests pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Budget Overview</CardTitle>
          <CardDescription>Monthly budget allocation and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetCategories.map((budget, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <budget.icon className="h-5 w-5 text-maritime-ocean" />
                  <span className="font-medium text-maritime-navy">{budget.category}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-maritime-anchor">Spent</span>
                    <span className="text-maritime-navy">{formatCurrency(budget.spent)}</span>
                  </div>
                  <Progress 
                    value={(budget.spent / budget.budgeted) * 100} 
                    className="h-2" 
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-maritime-anchor">
                      {formatCurrency(budget.remaining)} remaining
                    </span>
                    <span className="text-maritime-navy">
                      {formatCurrency(budget.budgeted)} total
                    </span>
                  </div>
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
            placeholder="Search expenses..."
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
            variant={filterCategory === 'fuel' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('fuel')}
          >
            Fuel
          </Button>
          <Button
            variant={filterCategory === 'maintenance' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('maintenance')}
          >
            Maintenance
          </Button>
          <Button
            variant={filterCategory === 'payroll' ? 'default' : 'outline'}
            onClick={() => setFilterCategory('payroll')}
          >
            Payroll
          </Button>
        </div>
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-maritime-navy">Recent Expenses</CardTitle>
          <CardDescription>Latest financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 border border-maritime-foam rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-maritime-navy">{expense.description}</div>
                    <Badge className={getCategoryColor(expense.category)}>
                      {expense.category}
                    </Badge>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-maritime-anchor">
                    <span>{expense.vessel}</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-maritime-navy">
                    {formatCurrency(expense.amount)}
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
    </div>
  );
};

export default Finance;
