import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckoutAddress } from '../components/AddressForm';


interface CheckoutState {
  address: CheckoutAddress | null;
}

const initialState: CheckoutState = {
  address: null,
};

const checkoutAddressSlice = createSlice({
  name: 'checkoutAddress',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<CheckoutAddress>) => {
      state.address = action.payload;
    },
    clearAddress: (state) => {
      state.address = null;
    },
  },
});


export const { setAddress, clearAddress } = checkoutAddressSlice.actions;


export default checkoutAddressSlice.reducer;
