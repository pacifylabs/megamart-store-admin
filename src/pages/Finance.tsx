import { useEffect, useMemo, useState } from 'react';
import { DataTable, type Column } from '../components/ui/DataTable';
import { SummaryCard } from '../components/SummaryCard';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Download, 
  Plus, 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { cn } from '../lib/utils';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction } from '../types/transaction';
import { usePageTitle } from "../context/PageTitleContext";

export default function Finance() {
  const [dateRange, setDateRange] = useState<string>('this-month');
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Finance');
  }, [setPageTitle]);
  const {
    transactions,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalCount,
  } = useTransactions(100);

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const summaryData = [
    {
      title: 'Total Revenue',
      value: '$24,780.00',
      change: 12.5,
      changeType: 'increase' as const,
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: 'Total Expenses',
      value: '$12,345.67',
      change: 3.2,
      changeType: 'increase' as const,
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: 'Net Profit',
      value: '$12,434.33',
      change: 8.9,
      changeType: 'increase' as const,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: 5.7,
      changeType: 'increase' as const,
      icon: <Users className="h-5 w-5" />
    }
  ];

  const columns = useMemo<Column<Transaction>[]>(() => [
    {
      header: 'Date',
      accessor: 'date',
      cell: (value: string) => new Date(value).toLocaleDateString(),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Description',
      accessor: 'description',
      className: 'min-w-[200px]',
    },
    {
      header: 'Category',
      accessor: 'category',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Amount',
      accessor: (item) => (
        <span className={cn(
          'font-medium',
          item.type === 'income' ? 'text-green-600' : 'text-red-600'
        )}>
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </span>
      ),
      align: 'right',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span className={cn(
          'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
          value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        )}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
  ], []);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let fromDate: Date;
    
    switch (dateRange) {
      case 'today':
        fromDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'this-week':
        fromDate = new Date(now.setDate(now.getDate() - now.getDay()));
        break;
      case 'last-month':
        fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'this-year':
        fromDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // this-month
        fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return transactions.filter(tx => {
      const matchesDate = new Date(tx.date) >= fromDate;
      const matchesSearch = searchQuery === '' || 
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.amount.toString().includes(searchQuery);
      
      return matchesDate && matchesSearch;
    });
  }, [transactions, dateRange, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1> */}
            <p className="text-gray-500 mt-1">Overview of your financial performance</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <SummaryCard key={index} {...item} />
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" title="More filters">
                <Filter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" title="Export">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || dateRange) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Filters:</span>
              
              {searchQuery && (
                <div className="inline-flex items-center bg-gray-50 text-sm rounded-md px-3 py-1.5 border">
                  <span className="text-muted-foreground">Search: </span>
                  <span className="ml-1 font-medium">{searchQuery}</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                </div>
              )}
              
              <div className="inline-flex items-center bg-gray-50 text-sm rounded-md px-3 py-1.5 border">
                <span className="text-muted-foreground">Period: </span>
                <span className="ml-1 font-medium">
                  {dateRange === 'today' ? 'Today' : 
                   dateRange === 'this-week' ? 'This Week' : 
                   dateRange === 'last-month' ? 'Last Month' : 
                   dateRange === 'this-year' ? 'This Year' : 'This Month'}
                </span>
                <button 
                  onClick={() => setDateRange('this-month')}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear period filter"
                >
                  &times;
                </button>
              </div>
              
              {(searchQuery || dateRange !== 'this-month') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setDateRange('this-month');
                  }}
                  className="text-sm text-primary hover:underline ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {filteredTransactions.length ? `${filteredTransactions.length} ${(dateRange === 'this-month' || dateRange === 'today') ? 'Recent Transactions' : filteredTransactions[0].type + 's'}` : 'No ' + (dateRange === 'this-month' || dateRange === 'today') ? 'Recent Transactions' : filteredTransactions[0].type + 's'}
            </h3>
          </div>
            <div>
              <DataTable
                data={filteredTransactions}
                columns={columns}
                onEdit={(item) => console.log('Edit:', item)}
                onDelete={(id) => console.log('Delete:', id)}
                emptyMessage="No transactions found for the selected period"
                aria-label="Financial transactions"
                className="mt-4"
              />
              
              {filteredTransactions.length > 0 && (
                <div className="flex items-center justify-between px-2 mt-2">
                  <div className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{filteredTransactions.length}</span> transactions
                  </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                      value={`${itemsPerPage}`}
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={itemsPerPage} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Button>
                    <div className="flex items-center justify-center text-sm font-medium">
                      {currentPage} / {totalPages || 1}
                    </div>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <span className="sr-only">Go to next page</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
