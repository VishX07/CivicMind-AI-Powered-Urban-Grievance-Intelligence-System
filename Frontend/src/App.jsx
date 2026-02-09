// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateComplaint from './pages/CreateComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-complaint" element={<CreateComplaint />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
        </Route>

        <Route
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
