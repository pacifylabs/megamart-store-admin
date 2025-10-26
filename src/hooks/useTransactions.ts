import { useState, useMemo } from 'react';
import { Transaction, DateRange } from '../types/transaction';

const generateMockTransactions = (count: number): Transaction[] => {
  const categories = ['Sales', 'Refund', 'Supplier Payment', 'Salary', 'Marketing', 'Utilities'];
  const statuses: Transaction['status'][] = ['completed', 'pending', 'failed'];
  const types: Transaction['type'][] = ['income', 'expense'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `TXN-${1000 + i}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: `Transaction ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: Math.round((Math.random() * 5000 + 100) * 100) / 100,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

export function useTransactions(initialCount = 100) {
  const [transactions] = useState<Transaction[]>(() => generateMockTransactions(initialCount));
  const [dateRange, setDateRange] = useState<DateRange>('this-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let fromDate = new Date();

    switch (dateRange) {
      case 'today':
        fromDate.setHours(0, 0, 0, 0);
        break;
      case 'this-week':
        fromDate.setDate(now.getDate() - now.getDay());
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

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  return {
    transactions: paginatedTransactions,
    filteredTransactions,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalCount: filteredTransactions.length,
  };
}
