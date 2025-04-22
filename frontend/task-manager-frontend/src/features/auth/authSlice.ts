import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface RegisterPayload {
  username: string;
  password: string;
}

export const login = createAsyncThunk('auth/login', async (credentials:RegisterPayload) => {
  try {
    const res = await axios.post('/auth/login', credentials);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = (axiosError.response?.data as { message: string })?.message || 'Login failed';
    throw new Error(errorMessage);
  }
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

interface AuthState {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem('token');
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        toast.success(action.payload.message || 'Login successful');
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        toast.error(action.error.message || 'Login failed');
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        toast.success(action.payload.message || 'Registration successful');
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Registration failed';
        toast.error(action.payload as string || 'Registration failed');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;