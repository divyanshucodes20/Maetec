
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTasks, updateTask, deleteTask, createTask } from "../features/tasks/tasksSlice"
import type { AppDispatch } from "../app/store"
import { toast } from "react-toastify"
import { useAppSelector } from "../hooks/use-selector"
import { Plus } from "lucide-react"
import Navbar from "../components/navbar"
import TaskCard from "../components/card/task"
import TaskDialog from "../components/dialog/task"
import ConfirmDialog from "../components/dialog/confirm"
import styles from "./TasksPage.module.css"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  userId?: string
}

const TasksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list: tasks, status: tasksStatus, error: tasksError } = useSelector((state: any) => state.tasks)
  const authStatus = useAppSelector((state) => state.auth.status)

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  useEffect(() => {
    if (tasksStatus === "failed" && tasksError) {
      toast.error(tasksError)
    }
  }, [tasksStatus, tasksError])

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
  }

  const handleOpenEditDialog = (task: Task) => {
    setCurrentTask(task)
    setIsEditDialogOpen(true)
  }

  const handleOpenDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateTask = (task: Task) => {
    dispatch(createTask(task))
    setIsAddDialogOpen(false)
    toast.success("Task created successfully!")
  }

  const handleUpdateTask = (task: Task) => {
    dispatch(updateTask(task))
    setIsEditDialogOpen(false)
    toast.success("Task updated successfully!")
  }

  const handleDeleteTask = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete))
      toast.success("Task deleted successfully!")
    }
  }

  // Filter tasks by status
  const pendingTasks = tasks.filter((task: Task) => task.status === "pending")
  const inProgressTasks = tasks.filter((task: Task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task: Task) => task.status === "completed")

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>My Tasks</h1>
          <button
            onClick={handleOpenAddDialog}
            className={styles.addButton}
            disabled={tasksStatus === "loading" || authStatus === "loading"}
          >
            <Plus className={styles.addIcon} />
            Add New Task
          </button>
        </div>

        {tasksStatus === "loading" ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : (
          <div className={styles.boardContainer}>
            {/* Pending Tasks Column */}
            <div className={`${styles.column} ${styles.columnPending}`}>
              <h2 className={styles.columnHeader}>
                <span className={`${styles.statusDot} ${styles.dotPending}`}></span>
                Pending ({pendingTasks.length})
              </h2>
              <div className={styles.tasksList}>
                {pendingTasks.length === 0 ? (
                  <p className={styles.emptyMessage}>No pending tasks</p>
                ) : (
                  pendingTasks.map((task: Task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleOpenEditDialog}
                      onDelete={handleOpenDeleteDialog}
                    />
                  ))
                )}
              </div>
            </div>

            {/* In Progress Tasks Column */}
            <div className={`${styles.column} ${styles.columnInProgress}`}>
              <h2 className={styles.columnHeader}>
                <span className={`${styles.statusDot} ${styles.dotInProgress}`}></span>
                In Progress ({inProgressTasks.length})
              </h2>
              <div className={styles.tasksList}>
                {inProgressTasks.length === 0 ? (
                  <p className={styles.emptyMessage}>No tasks in progress</p>
                ) : (
                  inProgressTasks.map((task: Task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleOpenEditDialog}
                      onDelete={handleOpenDeleteDialog}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Completed Tasks Column */}
            <div className={`${styles.column} ${styles.columnCompleted}`}>
              <h2 className={styles.columnHeader}>
                <span className={`${styles.statusDot} ${styles.dotCompleted}`}></span>
                Completed ({completedTasks.length})
              </h2>
              <div className={styles.tasksList}>
                {completedTasks.length === 0 ? (
                  <p className={styles.emptyMessage}>No completed tasks</p>
                ) : (
                  completedTasks.map((task: Task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleOpenEditDialog}
                      onDelete={handleOpenDeleteDialog}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Dialogs */}
      <TaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleCreateTask}
        dialogType="add"
      />

      <TaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        task={currentTask}
        onSave={handleUpdateTask}
        dialogType="edit"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  )
}

export default TasksPage
