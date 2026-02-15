// src/components/common/Navbar.jsx
import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
} from 'react-icons/ai';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Desktop nav link styling
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm lg:text-base ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  // Mobile nav link styling
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-semibold ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
    }`;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl bg-slate-900/95 border-b transition-all duration-300 ${
          scrolled
            ? 'border-slate-700/80 shadow-2xl'
            : 'border-slate-700/50 shadow-xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              {/* Logo Icon with Gradient */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-shadow">
                <span className="text-white font-bold text-base sm:text-lg lg:text-xl">
                  CF
                </span>
              </div>

              {/* Logo Text with Gradient */}
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                CityFix
              </h1>
            </div>

            {/* Desktop Navigation Links (Hidden on mobile/tablet) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {user?.role === 'citizen' && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <AiOutlineDashboard size={20} />
                    <span>Dashboard</span>
                  </NavLink>

                  <NavLink to="/create-complaint" className={navLinkClass}>
                    <AiOutlinePlus size={20} />
                    <span>New Complaint</span>
                  </NavLink>

                  <NavLink to="/my-complaints" className={navLinkClass}>
                    <AiOutlineUnorderedList size={20} />
                    <span>My Complaints</span>
                  </NavLink>
                </>
              )}

              {user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass}>
                  <AiOutlineDashboard size={20} />
                  <span>Admin Dashboard</span>
                </NavLink>
              )}
            </div>

            {/* Desktop User Info & Logout */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {/* User Info Card - Only on large screens */}
              <div className="hidden lg:flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-3 xl:px-4 py-2 shadow-lg hover:bg-white/10 transition-all">
                <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center shadow-md">
                  <AiOutlineUser size={18} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-xs text-blue-300 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 px-3 lg:px-4 py-2.5 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-red-500/30 active:scale-95"
              >
                <AiOutlineLogout size={18} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <AiOutlineClose size={22} />
              ) : (
                <AiOutlineMenu size={22} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">CF</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CityFix
              </h2>
            </div>
            <button
              onClick={closeMobileMenu}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <AiOutlineClose size={22} className="text-gray-600" />
            </button>
          </div>

          {/* User Profile Section (Mobile) */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500 flex items-center justify-center shadow-xl">
                <AiOutlineUser size={28} className="text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-lg sm:text-xl">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-600 capitalize font-medium">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-2">
            {user?.role === 'citizen' && (
              <>
                <NavLink
                  to="/dashboard"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  <AiOutlineDashboard size={22} />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/create-complaint"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  <AiOutlinePlus size={22} />
                  <span>New Complaint</span>
                </NavLink>

                <NavLink
                  to="/my-complaints"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  <AiOutlineUnorderedList size={22} />
                  <span>My Complaints</span>
                </NavLink>
              </>
            )}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                <AiOutlineDashboard size={22} />
                <span>Admin Dashboard</span>
              </NavLink>
            )}
          </div>

          {/* Mobile Logout Button */}
          <div className="p-5 sm:p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg shadow-red-500/30 active:scale-95"
            >
              <AiOutlineLogout size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
