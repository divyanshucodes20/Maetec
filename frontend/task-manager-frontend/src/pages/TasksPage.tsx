import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask, createTask } from '../features/tasks/tasksSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  userId?: string;
}

const TasksPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: tasks } = useSelector((state: any) => state.tasks);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState<Task>({
    id: '', 
    title: '',
    description: '',
    status: 'pending',
  });

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSave = () => {
    if (editingTask) {
      dispatch(updateTask(editingTask));
      setEditingTask(null);
    }
  };

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingTask) {
      setEditingTask({
        ...editingTask,
        [e.target.name]: e.target.value,
      });
    } else {
      setNewTask({
        ...newTask,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createTask(newTask));
    setNewTask({ id: '', title: '', description: '', status: 'pending' });
  };

  return (
    <div>
      <h1>Tasks Page</h1>

      {/* Create New Task Form */}
      <form onSubmit={handleCreate}>
        <h2>Create Task</h2>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleChange}
          placeholder="Task Description"
          required
        />
        <select
          name="status"
          value={newTask.status}
          onChange={handleChange}
          required
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Create Task</button>
      </form>

      {/* Render tasks list */}
      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id}>
            {editingTask?.id === task.id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={handleChange}
                />
                <textarea
                  name="description"
                  value={editingTask.description}
                  onChange={handleChange}
                />
                <select
                  name="status"
                  value={editingTask.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setEditingTask(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Logout button */}
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default TasksPage;
