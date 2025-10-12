import { configureStore } from '@reduxjs/toolkit'
import transactionTypes from '@/features/transactionTypes/transactionTypeSlice'


configureStore({
    reducer: {
        transactionTypes
    },
})

export default store
