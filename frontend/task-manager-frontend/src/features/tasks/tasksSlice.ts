import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface TasksState {
  list: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Async thunks for task operations
export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  const res = await axios.get('/tasks');
  return res.data.tasks; // Assuming response has a tasks property
});

export const createTask = createAsyncThunk('tasks/create', async (taskData: Task) => {
  const res = await axios.post('/tasks', taskData);
  return res.data.task;
});

export const updateTask = createAsyncThunk('tasks/update', async (taskData: Task) => {
  const res = await axios.put(`/tasks/${taskData.id}`, taskData);
  return res.data.task;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId: string) => {
  await axios.delete(`/tasks/${taskId}`);
  return taskId; // Return taskId to be used in reducers
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], status: 'idle' } as TasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
