// src/components/common/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
