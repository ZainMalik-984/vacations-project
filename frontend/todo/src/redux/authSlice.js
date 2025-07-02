import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: localStorage.getItem('auth') === 'true',
  role: localStorage.getItem('role') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;

      localStorage.setItem('auth', 'true');
      localStorage.setItem('role', action.payload.role);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;

      localStorage.setItem('auth', 'false');
      localStorage.removeItem('role');
    },
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
