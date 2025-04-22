import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask, deleteTask, createTask } from '../features/tasks/tasksSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store';
import styles from '../components/TaskList.module.css';
import { toast } from 'react-toastify';
import { useAppSelector } from '../hooks/use-selector';

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
  const { list: tasks, status: tasksStatus, error: tasksError } = useSelector((state: any) => state.tasks);
  const authStatus = useAppSelector((state) => state.auth.status);

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

  useEffect(() => {
    if (tasksStatus === 'failed' && tasksError) {
      toast.error(tasksError);
    }
    if (tasksStatus === 'succeeded' && editingTask) {
      toast.success('Task updated successfully!');
    }
    if (tasksStatus === 'succeeded' && newTask.title) {
      toast.success('Task created successfully!');
      setNewTask({ id: '', title: '', description: '', status: 'pending' });
    }
  }, [tasksStatus, tasksError, editingTask, newTask.title]);

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
    toast.success('Task deleted successfully!');
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
  };
  return (
    <div className={styles.tasksContainer}>
      <h1 className={styles.tasksContainer}>Tasks Page</h1>

      {/* Create New Task Form */}
      <div className={styles.createTaskForm}>
        <h2>Create Task</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
            className={styles.input}
          />
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            placeholder="Task Description"
            required
            className={styles.input}
          />
          <select
            name="status"
            value={newTask.status}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" className={styles.button} disabled={tasksStatus === 'loading' || authStatus === 'loading'}>
            {tasksStatus === 'loading' || authStatus === 'loading' ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>

      {/* Render tasks list */}
      <ul className={styles.tasksList}>
        {tasks.map((task: Task) => (
          <li key={task.id} className={styles.taskItem}>
            {editingTask?.id === task.id ? (
              <div className={styles.taskDetails}>
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={handleChange}
                  className={styles.input}
                />
                <textarea
                  name="description"
                  value={editingTask.description}
                  onChange={handleChange}
                  className={styles.input}
                />
                <select
                  name="status"
                  value={editingTask.status}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <div className={styles.taskActions}>
                  <button onClick={handleSave} disabled={tasksStatus === 'loading' || authStatus === 'loading'}>
                    {tasksStatus === 'loading' || authStatus === 'loading' ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingTask(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className={styles.taskDetails}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <div className={styles.taskActions}>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Logout button */}
      <button onClick={handleLogout} className={styles.logoutButton} disabled={authStatus === 'loading'}>
        {authStatus === 'loading' ? 'Logging Out...' : 'Logout'}
      </button>
    </div>
  );
};

export default TasksPage;