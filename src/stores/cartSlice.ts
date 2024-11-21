import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../pages/ShoppingCart';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  loading: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
      },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.totalAmount = action.payload.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.totalAmount = state.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
    setTotalAmount: (state,action) => {
      state.totalAmount = action.payload;
    },
    getTheCartItem: (state,action) => {
      state.items = action.payload;
    },
  },
});

export const { setCartItems, updateCartItemQuantity, removeFromCart, clearCart, addToCart,setTotalAmount,getTheCartItem } =
  cartSlice.actions;

export default cartSlice.reducer;
