
import type React from "react"
import { Edit, Trash2 } from "lucide-react"
import styles from "./TaskCard.module.css"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  userId?: string
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return styles.statusPending
      case "in-progress":
        return styles.statusInProgress
      case "completed":
        return styles.statusCompleted
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "in-progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{task.title}</h3>
        <p className={styles.cardDescription}>{task.description}</p>

        <div className={styles.cardFooter}>
          <span className={`${styles.statusBadge} ${getStatusClass(task.status)}`}>{getStatusText(task.status)}</span>

          <div className={styles.cardActions}>
            <button onClick={() => onEdit(task)} className={`${styles.actionButton} ${styles.editButton}`}>
              <Edit className={styles.actionIcon} />
            </button>
            <button onClick={() => onDelete(task.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
              <Trash2 className={styles.actionIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
