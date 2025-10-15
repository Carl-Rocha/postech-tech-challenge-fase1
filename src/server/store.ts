export type StoredUser = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type StoredAccount = {
  id: string;
  userId: string;
  balance: number;
  accountNumber: string;
  createdAt: Date;
};

export type StoredTransaction = {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  balance: number;
};

// In-memory stores (shared across API route modules via Node module cache)
export const users: StoredUser[] = [];
export const accounts: StoredAccount[] = [];
export const transactions: StoredTransaction[] = [];
