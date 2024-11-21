import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentDetails } from '../components/PaymentForm';

interface PaymentState {
  paymentDetails: PaymentDetails | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PaymentState = {
  paymentDetails: null,
  loading: false,
  error: null,
  success: false,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentDetails(state, action: PayloadAction<PaymentDetails>) {
      state.paymentDetails = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSuccess(state, action: PayloadAction<boolean>) {
      state.success = action.payload;
    },
  },
});

export const { setPaymentDetails, setLoading, setError, setSuccess } = paymentSlice.actions;

export default paymentSlice.reducer;
