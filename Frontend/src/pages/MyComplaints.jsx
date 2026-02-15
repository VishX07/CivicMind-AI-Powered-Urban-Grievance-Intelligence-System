// src/pages/MyComplaints.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineEnvironment,
  AiOutlineCalendar,
  AiOutlineFire,
  AiOutlineFileText,
  AiOutlinePlus,
} from 'react-icons/ai';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, resolved
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/my');
      setComplaints(data.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <AiOutlineCheckCircle size={18} />;
      case 'in-progress':
        return <AiOutlineClockCircle size={18} />;
      case 'rejected':
        return <AiOutlineCloseCircle size={18} />;
      default:
        return <AiOutlineFileText size={18} />;
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 8) return 'text-red-400';
    if (priority >= 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'pending')
      return ['open', 'processing', 'in-progress'].includes(c.status);
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                My Complaints
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Track and manage your submitted complaints
              </p>
            </div>
            <button
              onClick={() => navigate('/create-complaint')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 sm:px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/30 active:scale-95 whitespace-nowrap"
            >
              <AiOutlinePlus size={20} />
              <span className="hidden sm:inline">New Complaint</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            All ({complaints.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Pending (
            {
              complaints.filter((c) =>
                ['open', 'processing', 'in-progress'].includes(c.status),
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 sm:px-6 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              filter === 'resolved'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            Resolved ({complaints.filter((c) => c.status === 'resolved').length}
            )
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Loading complaints...
            </p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          /* Empty State */
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AiOutlineFileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              No complaints found
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mb-6">
              {filter === 'all'
                ? "You haven't submitted any complaints yet"
                : `No ${filter} complaints`}
            </p>
            <button
              onClick={() => navigate('/create-complaint')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg active:scale-95"
            >
              <AiOutlinePlus size={20} />
              Create Your First Complaint
            </button>
          </div>
        ) : (
          /* Complaints Grid */
          <div className="grid gap-4 sm:gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 hover:bg-white/15 transition-all duration-200 hover:scale-[1.01]"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-blue-300 font-bold text-base sm:text-lg">
                        {complaint.category}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(complaint.status)}`}
                      >
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                    <AiOutlineFire
                      className={getPriorityColor(complaint.priority)}
                      size={18}
                    />
                    <span
                      className={`font-bold text-sm ${getPriorityColor(complaint.priority)}`}
                    >
                      {complaint.priority}/10
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
                  {complaint.description}
                </p>

                {/* Image Preview */}
                {complaint.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint"
                      className="w-full h-48 sm:h-64 object-cover rounded-xl border border-white/10"
                    />
                  </div>
                )}

                {/* Footer Info */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                  {complaint.address && (
                    <div className="flex items-center gap-1.5">
                      <AiOutlineEnvironment size={16} />
                      <span className="truncate max-w-[200px] sm:max-w-none">
                        {complaint.address}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <AiOutlineCalendar size={16} />
                    <span>
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {complaint.latitude && complaint.longitude && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      <AiOutlineEnvironment size={16} />
                      <span>View on Map</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;
