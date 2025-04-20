import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

import { AxiosError } from 'axios';

interface RegisterPayload {
  username: string;
  password: string;
}

export const login = createAsyncThunk('auth/login', async (credentials:RegisterPayload) => {
  const res = await axios.post('/auth/login', credentials);
  localStorage.setItem('token', res.data.token);
  return res.data;
});
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as { message: string })?.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token') || null, status: 'idle' },
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
