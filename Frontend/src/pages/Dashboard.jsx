// src/pages/Dashboard.jsx (REMOVE Navbar import and component)
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Welcome, {user?.name}!
        </h2>
        <p className="text-slate-400 mb-8">Submit and track your complaints</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/create-complaint')}
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <h3 className="text-xl font-semibold mb-2">Create Complaint</h3>
            <p className="text-sm text-blue-100">Submit a new grievance</p>
          </button>

          <button
            onClick={() => navigate('/my-complaints')}
            className="bg-slate-700 text-white p-6 rounded-lg hover:bg-slate-600 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-2">My Complaints</h3>
            <p className="text-sm text-slate-300">View your submissions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
