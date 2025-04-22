
import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { register } from "../features/auth/authSlice"
import type { AppDispatch } from "../app/store"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { Clipboard, UserPlus, User, Lock, KeyRound } from "lucide-react"
import { useAppSelector } from "../hooks/use-selector"
import styles from "./CreateAccount.module.css"

const CreateAccountPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { status } = useAppSelector((state) => state.auth)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password || !confirmPassword) {
      toast.error("Please fill in all fields!")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    dispatch(register({ username, password }))
  }

  // Navigate only when registration is successful
  useEffect(() => {
    if (status === "succeeded") {
      navigate("/tasks")
    }
  }, [status, navigate])

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.logoCircle}>
          <Clipboard className={styles.logoIcon} />
        </div>
        <h2 className={styles.appTitle}>TaskMaster</h2>
        <p className={styles.appSubtitle}>Create a new account</p>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formCard}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Username
              </label>
              <div className={styles.inputWrapper}>
                <User className={styles.inputIcon} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.formInput}
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
              <div className={styles.inputWrapper}>
                <KeyRound className={styles.inputIcon} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={status === "loading"}>
              <UserPlus className={styles.buttonIcon} />
              {status === "loading" ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>
              <span className={styles.dividerTextInner}>Already have an account?</span>
            </div>
          </div>

          <div className={styles.alternateAction}>
            <Link to="/login" className={styles.alternateButton}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountPage
