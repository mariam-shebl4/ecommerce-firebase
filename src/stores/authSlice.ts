import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface User {
  id: number |string;
  name: string;
  email: string;
  accessToken: string;
  uid?:string ;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  accessToken?: string;
}

const initialState: AuthState = {
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
  isAuthenticated: !!Cookies.get('access_token'), 
  error: null,
  accessToken: Cookies.get('access_token') || undefined, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.accessToken = action.payload.accessToken; 
      if (!action.payload.uid) {
        console.error('User UID is missing in the payload!');
      }
      Cookies.set('user', JSON.stringify(action.payload), { path: '/' });
      Cookies.set('access_token', action.payload.accessToken, { path: '/' }); 
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.accessToken = undefined;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = undefined;  
      Cookies.remove('user');
      Cookies.remove('access_token'); 
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      Cookies.set('access_token', action.payload, { path: '/' }); 
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateUserName(state, action) {
      if (state.user) {
        state.user.name = action.payload; 
      }},
  },
});

export const { loginSuccess, loginFailure, logout, setAccessToken,setUser,updateUserName } = authSlice.actions;
export default authSlice.reducer;
