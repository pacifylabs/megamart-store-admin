export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type DateRange = 'today' | 'this-week' | 'this-month' | 'last-month' | 'this-year';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: TransactionStatus;
}
