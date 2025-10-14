import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from '@/features/transactions/transactionSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['transactions/setTransactions', 'transactions/addTransaction', 'transactions/updateTransaction'],
        ignoredPaths: ['transactions.transactions'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
