import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    types: [

    ]
}

const transactionTypeSlices = createSlice({
    name: 'transactionTypes',
    initialState
})

export default transactionTypeSlices.reducer