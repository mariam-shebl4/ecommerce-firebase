import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import cartReducer from './cartSlice'; 
import checkoutAddressReducer from './checkoutAddressSlice'; 
import paymentReducer from './paymentSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    cart: cartReducer,
    checkoutAddress: checkoutAddressReducer,
    payment: paymentReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
