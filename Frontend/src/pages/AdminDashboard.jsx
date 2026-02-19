// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import {
  AiOutlineFilter,
  AiOutlineEnvironment,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineFire,
  AiOutlineEye,
} from 'react-icons/ai';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editComplaint, setEditComplaint] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('newComplaint', (newComplaint) => {
      const matchesCategory =
        !selectedCategory || newComplaint.category === selectedCategory;
      const matchesStatus =
        !selectedStatus || newComplaint.status === selectedStatus;

      if (matchesCategory && matchesStatus) {
        setComplaints((prev) => [newComplaint, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [selectedCategory, selectedStatus]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);

      const { data } = await api.get(`/admin/complaints?${params.toString()}`);
      setComplaints(data.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    try {
      await api.patch(`/admin/complaints/${editComplaint._id}`, {
        status: editComplaint.status,
        category: editComplaint.category,
        priority: Number(editComplaint.priority),
      });

      setEditModalOpen(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 9) return 'text-red-400 bg-red-500/20';
    if (priority >= 7) return 'text-orange-400 bg-orange-500/20';
    if (priority >= 4) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
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
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Manage and resolve citizen complaints
          </p>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AiOutlineFilter size={20} className="text-blue-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">Filters</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              >
                <option className="text-black" value="">
                  All Categories
                </option>
                {/* <option className="text-black">Waste Management</option>
                <option className="text-black">Water Supply</option>
                <option className="text-black">Road Damage</option>
                <option className="text-black">Streetlights</option>
                <option className="text-black">Sanitation</option>
                <option className="text-black">Testing</option>
                <option className="text-black">Others</option> */}
                <option className="text-black">Public Property Damage</option>
                <option className="text-black">Electricity Issue</option>
                <option className="text-black">Illegal Construction</option>
                <option className="text-black">Drainage Issue</option>
                <option className="text-black">Street Lights</option>
                <option className="text-black">Garbage Collection</option>
                <option className="text-black">Encroachment</option>
                <option className="text-black">Noise Pollution</option>
                <option className="text-black">Stray Animals</option>
                <option className="text-black">Tree Related</option>
                <option className="text-black">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
              >
                <option className="text-black" value="">
                  All Status
                </option>
                <option className="text-black" value="processing">
                  Processing
                </option>
                <option className="text-black" value="open">
                  Open
                </option>
                <option className="text-black" value="in-progress">
                  In Progress
                </option>
                <option className="text-black" value="resolved">
                  Resolved
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Loading complaints...
            </p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
            <p className="text-slate-300 text-base sm:text-lg">
              No complaints found
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 hover:bg-white/15 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="text-blue-300 font-bold text-base sm:text-lg">
                        {complaint.category}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(complaint.status)}`}
                      >
                        {complaint.status}
                      </span>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getPriorityColor(complaint.priority)}`}
                      >
                        <AiOutlineFire size={16} />
                        <span className="font-bold text-xs sm:text-sm">
                          Priority {complaint.priority}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {complaint.description}
                    </p>

                    {/* Address */}
                    {complaint.address && (
                      <div className="flex items-start gap-2 text-slate-400 text-sm sm:text-base">
                        <AiOutlineEnvironment
                          size={18}
                          className="flex-shrink-0 mt-1"
                        />
                        <span>{complaint.address}</span>
                      </div>
                    )}

                    {/* User Info */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                      {complaint.userId?.name && (
                        <div className="flex items-center gap-1.5">
                          <AiOutlineUser size={16} />
                          <span>{complaint.userId.name}</span>
                        </div>
                      )}
                      {complaint.userId?.phone && (
                        <div className="flex items-center gap-1.5">
                          <AiOutlinePhone size={16} />
                          <span>{complaint.userId.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <AiOutlineCalendar size={16} />
                        <span>
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Image & Actions */}
                  <div className="w-full lg:w-72 flex flex-col gap-3">
                    {/* Image */}
                    {complaint.imageUrl && (
                      <div className="relative group">
                        <img
                          src={complaint.imageUrl}
                          alt="Complaint"
                          className="w-full h-48 object-cover rounded-xl border border-white/10 cursor-pointer"
                          onClick={() => setSelectedImage(complaint.imageUrl)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <AiOutlineEye size={32} className="text-white" />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-500/60 border border-green-500/30 text-green-300 px-4 py-2.5 rounded-xl hover:bg-green-500/30 transition-all font-semibold text-sm"
                      >
                        <AiOutlineEnvironment size={18} />
                        <span>Open Map</span>
                      </a>

                      <button
                        onClick={() => {
                          setEditComplaint(complaint);
                          setEditModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-blue-500/60 border border-blue-500/30 text-blue-300 px-4 py-2.5 rounded-xl hover:bg-blue-500/30 transition-all font-semibold text-sm"
                      >
                        <AiOutlineEdit size={18} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Full View"
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all shadow-lg"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && editComplaint && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="backdrop-blur-xl bg-slate-900 border border-white/20 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                Edit Complaint
              </h3>

              <div className="space-y-5">
                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editComplaint.status}
                    onChange={(e) =>
                      setEditComplaint({
                        ...editComplaint,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option className="text-black" value="processing">
                      Processing
                    </option>
                    <option className="text-black" value="open">
                      Open
                    </option>
                    <option className="text-black" value="in-progress">
                      In Progress
                    </option>
                    <option className="text-black" value="resolved">
                      Resolved
                    </option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={editComplaint.category}
                    onChange={(e) =>
                      setEditComplaint({
                        ...editComplaint,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {/* <option className="text-black">Waste Management</option>
                    <option className="text-black">Water Supply</option>
                    <option className="text-black">Road Damage</option>
                    <option className="text-black">Streetlights</option>
                    <option className="text-black">Sanitation</option>
                    <option className="text-black">Others</option> */}
                    <option className="text-black">
                      Public Property Damage
                    </option>
                    <option className="text-black">Electricity Issue</option>
                    <option className="text-black">Illegal Construction</option>
                    <option className="text-black">Drainage Issue</option>
                    <option className="text-black">Street Lights</option>
                    <option className="text-black">Garbage Collection</option>
                    <option className="text-black">Encroachment</option>
                    <option className="text-black">Noise Pollution</option>
                    <option className="text-black">Stray Animals</option>
                    <option className="text-black">Tree Related</option>
                    <option className="text-black">Other</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editComplaint.priority}
                    onChange={(e) =>
                      setEditComplaint({
                        ...editComplaint,
                        priority: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateComplaint}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl transition-all font-semibold shadow-lg active:scale-95"
                  >
                    <AiOutlineCheck size={20} />
                    <span>Save Changes</span>
                  </button>

                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 border-2 border-white/20 text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all font-semibold active:scale-95"
                  >
                    <AiOutlineClose size={20} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
