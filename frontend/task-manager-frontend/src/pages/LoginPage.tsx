
import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { login } from "../features/auth/authSlice"
import type { AppDispatch } from "../app/store"
import { toast } from "react-toastify"
import { Link, useNavigate } from "react-router-dom"
import { Clipboard, LogIn, User, Lock } from "lucide-react"
import styles from "./LoginPage.module.css"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      toast.error("Please fill in both fields!")
      return
    }

    dispatch(login({ username, password }))
    navigate("/tasks")
  }

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <div className={styles.logoCircle}>
          <Clipboard className={styles.logoIcon} />
        </div>
        <h2 className={styles.appTitle}>TaskMaster</h2>
        <p className={styles.appSubtitle}>Sign in to manage your tasks</p>
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
                  placeholder="Enter your username"
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
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              <LogIn className={styles.buttonIcon} />
              Sign in
            </button>
          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerText}>
              <span className={styles.dividerTextInner}>Don't have an account?</span>
            </div>
          </div>

          <div className={styles.alternateAction}>
            <Link to="/create-account" className={styles.alternateButton}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
