// src/components/common/Navbar.jsx
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlinePlus,
  AiOutlineUnorderedList,
} from 'react-icons/ai';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              CityFix
            </h1>

            <div className="flex items-center space-x-1">
              {user?.role === 'citizen' && (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'text-blue-400 border-b-2 border-blue-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <AiOutlineDashboard size={18} />
                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink
                    to="/create-complaint"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'text-blue-400 border-b-2 border-blue-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <AiOutlinePlus size={18} />
                    <span>New Complaint</span>
                  </NavLink>

                  <NavLink
                    to="/my-complaints"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        isActive
                          ? 'text-blue-400 border-b-2 border-blue-400'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <AiOutlineUnorderedList size={18} />
                    <span>My Complaints</span>
                  </NavLink>
                </>
              )}

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <AiOutlineDashboard size={18} />
                  <span>Admin Dashboard</span>
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
            >
              <AiOutlineLogout size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
