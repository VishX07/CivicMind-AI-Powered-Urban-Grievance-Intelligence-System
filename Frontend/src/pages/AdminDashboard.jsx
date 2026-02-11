// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';

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
    const socket = io('http://localhost:5000');

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

      setComplaints(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority >= 9) return 'text-red-400';
    if (priority >= 7) return 'text-orange-400';
    if (priority >= 4) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-900/40 text-green-300';
      case 'in-progress':
        return 'bg-blue-900/40 text-blue-300';
      case 'open':
        return 'bg-yellow-900/40 text-yellow-300';
      case 'processing':
        return 'bg-purple-900/40 text-purple-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h2>

      {/* 🔹 FILTER SECTION */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
          >
            <option value="">All Categories</option>
            <option>Waste Management</option>
            <option>Water Supply</option>
            <option>Road Damage</option>
            <option>Streetlights</option>
            <option>Sanitation</option>
            <option>Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-white"
          >
            <option value="">All Status</option>
            <option value="processing">processing</option>
            <option value="open">open</option>
            <option value="in-progress">in-progress</option>
            <option value="resolved">resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">Loading...</div>
      ) : (
        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-blue-400 font-semibold text-lg">
                      {complaint.category}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        complaint.status,
                      )}`}
                    >
                      {complaint.status}
                    </span>

                    <span
                      className={`font-bold ${getPriorityColor(
                        complaint.priority,
                      )}`}
                    >
                      Priority {complaint.priority}
                    </span>
                  </div>

                  <p className="text-slate-300">{complaint.description}</p>

                  {complaint.address && (
                    <div className="text-slate-400 text-sm">
                      📍 {complaint.address}
                    </div>
                  )}

                  <div className="text-sm text-slate-400 space-y-1">
                    <div>👤 {complaint.userId?.name}</div>
                    {complaint.userId?.phone && (
                      <div>📞 {complaint.userId.phone}</div>
                    )}
                    <div>
                      📅 {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-64 flex flex-col gap-4">
                  {complaint.imageUrl && (
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint"
                      onClick={() => setSelectedImage(complaint.imageUrl)}
                      className="w-full h-48 object-cover rounded-xl cursor-pointer"
                    />
                  )}

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white py-2 rounded-lg text-center text-sm"
                  >
                    Open in Maps
                  </a>

                  <button
                    onClick={() => {
                      setEditComplaint(complaint);
                      setEditModalOpen(true);
                    }}
                    className="bg-blue-600 text-white py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
