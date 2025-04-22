
import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import styles from "./TaskDialog.module.css"

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  userId?: string
}

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onSave: (task: Task) => void
  dialogType: "add" | "edit"
}

const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onClose, task, onSave, dialogType }) => {
  const [formData, setFormData] = useState<Task>({
    id: "",
    title: "",
    description: "",
    status: "pending",
  })

  useEffect(() => {
    if (task && dialogType === "edit") {
      setFormData(task)
    } else {
      setFormData({
        id: "",
        title: "",
        description: "",
        status: "pending",
      })
    }
  }, [task, dialogType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3 className={styles.dialogTitle}>{dialogType === "add" ? "Create New Task" : "Edit Task"}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.dialogContent}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.formLabel}>
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={styles.formTextarea}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.formLabel}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {dialogType === "add" ? "Create Task" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskDialog
