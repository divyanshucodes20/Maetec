
import type React from "react"
import { AlertTriangle, X } from "lucide-react"
import styles from "./ConfirmDialog.module.css"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3 className={styles.dialogTitle}>{title}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.dialogContent}>
          <div className={styles.messageContainer}>
            <AlertTriangle className={styles.warningIcon} />
            <p className={styles.message}>{message}</p>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={styles.confirmButton}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
