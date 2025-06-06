import { Suspense, lazy } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const LoginPage = lazy(() => import("./pages/LoginPage"))
const CreateAccountPage = lazy(() => import("./pages/CreateAccount"))
const TasksPage = lazy(() => import("./pages/TasksPage"))
const ProtectedRoute = lazy(() => import("./hooks/ProtectedRoute"))

function App() {
  return (
    <>
      <Router>
        <Suspense
          fallback={
            <div className="loading-screen">
              <div className="loading-spinner"></div>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            {/* Protected route for tasks, wrapped with ProtectedRoute */}
            <Route path="/tasks" element={<ProtectedRoute component={TasksPage} />} />
            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  )
}

export default App
