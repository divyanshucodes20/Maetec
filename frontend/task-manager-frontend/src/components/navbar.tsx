
import { useNavigate } from 'react-router-dom';
import { Clipboard, Home, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const goHome = () => {
    navigate('/tasks');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={goHome}>
              <div className="flex items-center gap-2">
                <Clipboard className="h-8 w-8 text-white" />
                <span className="text-white font-bold text-xl">TaskMaster</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={goHome}
              className="flex items-center gap-1 text-white hover:bg-purple-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 text-white hover:bg-purple-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
