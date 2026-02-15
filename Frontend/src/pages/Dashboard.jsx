// src/pages/Dashboard.jsx
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineFileText,
  AiOutlineCloseCircle,
} from 'react-icons/ai';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all user complaints
      const { data } = await api.get('/complaints/my');
      const complaints = data.data || [];

      // Calculate stats
      const statsData = {
        total: complaints.length,
        pending: complaints.filter(
          (c) => c.status === 'open' || c.status === 'processing',
        ).length,
        inProgress: complaints.filter((c) => c.status === 'in-progress').length,
        resolved: complaints.filter((c) => c.status === 'resolved').length,
        rejected: complaints.filter((c) => c.status === 'rejected').length,
      };

      setStats(statsData);

      // Get 3 most recent complaints
      setRecentComplaints(complaints.slice(0, 3));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'open':
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 animate-slide-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Submit and track your civic complaints easily
              </p>
            </div>
            <button
              onClick={() => navigate('/create-complaint')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95"
            >
              <AiOutlinePlus size={20} />
              <span>New Complaint</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center text-white py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {/* Total Complaints */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <AiOutlineFileText className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.total}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  Total Complaints
                </p>
              </div>

              {/* Pending */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <AiOutlineClockCircle className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.pending}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  Pending
                </p>
              </div>

              {/* In Progress */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <AiOutlineUnorderedList className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.inProgress}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  In Progress
                </p>
              </div>

              {/* Resolved */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <AiOutlineCheckCircle className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.resolved}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  Resolved
                </p>
              </div>

              {/* Rejected */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <AiOutlineCloseCircle className="text-white text-xl sm:text-2xl" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stats.rejected}
                </p>
                <p className="text-slate-300 text-xs sm:text-sm font-medium">
                  Rejected
                </p>
              </div>
            </div>

            {/* Quick Actions & Recent Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Quick Actions */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={() => navigate('/create-complaint')}
                    className="w-full flex items-center gap-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 text-white p-4 sm:p-6 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 hover:border-blue-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                      <AiOutlinePlus size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-base sm:text-lg font-semibold">
                        Create Complaint
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-200">
                        Submit a new grievance
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/my-complaints')}
                    className="w-full flex items-center gap-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 text-white p-4 sm:p-6 rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                      <AiOutlineUnorderedList size={24} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-base sm:text-lg font-semibold">
                        My Complaints
                      </h4>
                      <p className="text-xs sm:text-sm text-purple-200">
                        View all submissions
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Complaints */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                  Recent Complaints
                </h3>
                {recentComplaints.length === 0 ? (
                  <div className="text-center text-slate-300 py-8">
                    <p className="text-sm sm:text-base">No complaints yet</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2">
                      Create your first complaint!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {recentComplaints.map((complaint) => (
                      <div
                        key={complaint._id}
                        className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => navigate('/my-complaints')}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="text-blue-300 font-semibold text-xs sm:text-sm flex-1">
                            {complaint.category}
                          </span>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}
                          >
                            {complaint.status}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs sm:text-sm line-clamp-2">
                          {complaint.description}
                        </p>
                        <p className="text-slate-400 text-xs mt-2">
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
