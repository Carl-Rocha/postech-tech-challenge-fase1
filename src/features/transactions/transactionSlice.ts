import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TransactionData {
  id: number;
  tipo: string;
  valor: number;
  data: string;
  comprovanteBase64?: string;
}

interface TransactionState {
  transactions: TransactionData[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<TransactionData[]>) => {
      state.transactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTransaction: (state, action: PayloadAction<TransactionData>) => {
      state.transactions.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<TransactionData>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    removeTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  updateTransaction,
  removeTransaction,
  setLoading,
  setError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
