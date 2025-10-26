import { useEffect, useMemo, useState, useCallback } from 'react';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { cn } from '../lib/utils';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction } from '../types/transaction';
import { usePageTitle } from "../context/PageTitleContext";
import { format } from 'date-fns';
import type { Column } from '../components/ui/DataTable';

export default function Finance() {
  const [dateRange, setDateRange] = useState<string>('this-month');
  const { setPageTitle } = usePageTitle();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  // const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPageTitle('Finance');
  }, [setPageTitle]);

  const {
    transactions,
    totalCount,
  } = useTransactions(100);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

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
      accessor: (item: { type: string; amount: number; }) => (
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

    return transactions
      .filter(tx => {
        const matchesDate = new Date(tx.date) >= fromDate;
        const matchesSearch = searchQuery === '' || 
          tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.amount.toString().includes(searchQuery);
        
        return matchesDate && matchesSearch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [transactions, dateRange, searchQuery, currentPage, itemsPerPage]);

  const handleAddTransaction = useCallback(() => {
    // setIsEditing(false);
    setSelectedTransaction(null);
    setIsAddModalOpen(true);
  }, []);

  // const handleEditTransaction = useCallback((transaction: Transaction) => {
  //   // setIsEditing(true);
  //   setSelectedTransaction(transaction);
  //   setIsAddModalOpen(true);
  // }, []);

  const handleDeleteTransaction = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      // TODO: Implement delete logic
      console.log('Delete transaction:', id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600">Overview of your financial performance</p>
            </div>
            <Button 
              onClick={handleAddTransaction}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              New Transaction
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryData.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{item.value}</p>
                  <div className={`mt-2 flex items-center text-sm ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.changeType === 'increase' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    )}
                    {item.change}% from last period
                  </div>
                </div>
                <div className={`p-3 rounded-full ${item.changeType === 'increase' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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
          {(searchQuery || dateRange !== 'this-month') && (
            <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t">
              <span className="text-sm text-gray-500">Filters:</span>
              
              {searchQuery && (
                <div className="inline-flex items-center bg-gray-50 text-sm rounded-md px-3 py-1.5 border">
                  <span className="text-gray-500">Search: </span>
                  <span className="ml-1 font-medium">{searchQuery}</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                </div>
              )}
              
              {dateRange !== 'this-month' && (
                <div className="inline-flex items-center bg-gray-50 text-sm rounded-md px-3 py-1.5 border">
                  <span className="text-gray-500">Period: </span>
                  <span className="ml-1 font-medium">
                    {dateRange === 'today' ? 'Today' : 
                     dateRange === 'this-week' ? 'This Week' : 
                     dateRange === 'last-month' ? 'Last Month' : 'This Year'}
                  </span>
                  <button 
                    onClick={() => setDateRange('this-month')}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear period filter"
                  >
                    &times;
                  </button>
                </div>
              )}
              
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setDateRange('this-month');
                }}
                className="text-sm text-blue-600 hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow-sm rounded-lg border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{transaction.category}</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {/* <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button> */}
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No transactions found for the selected period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startItem}</span> to{' '}
                    <span className="font-medium">{endItem}</span> of{' '}
                    <span className="font-medium">{totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {currentPage} / {totalPages || 1}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
