import { createSlice } from "@reduxjs/toolkit";
import {getNewProducts} from './asyncAction'

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProduct: null,
        errorMessage: '',
    },
    reducers: {
        // logout: (state) => {
        //   state.isLoading = false
        // }
    },
  extraReducers: (builder) => {
    builder.addCase(getNewProducts.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getNewProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProduct = action.payload;
    });

    builder.addCase(getNewProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
})

// export const { } = appSlice.actions

export default productSlice.reducer
