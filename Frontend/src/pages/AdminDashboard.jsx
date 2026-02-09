// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const categories = [
    'Waste Management',
    'Water Supply',
    'Road Damage',
    'Streetlights',
    'Sanitation',
    'Others',
  ];
  const statuses = ['processing', 'open', 'in-progress', 'resolved'];

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedStatus) params.append('status', selectedStatus);

      const { data } = await api.get(`/admin/complaints?${params.toString()}`);
      setComplaints(data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (complaint) => {
    setEditingId(complaint._id);
    setEditForm({
      status: complaint.status,
      category: complaint.category,
      priority: complaint.priority,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.patch(`/admin/complaints/${id}`, editForm);
      setEditingId(null);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
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
        return 'bg-green-900/50 text-green-300';
      case 'in-progress':
        return 'bg-blue-900/50 text-blue-300';
      case 'open':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'processing':
        return 'bg-purple-900/50 text-purple-300';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-100 mb-6">
        Admin Dashboard
      </h2>

      <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-300 py-12">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center text-slate-300">
          No complaints found
        </div>
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {editingId === complaint._id ? (
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Category
                          </label>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Status
                          </label>
                          <select
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                status: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-400 mb-1">
                            Priority (0-10)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={editForm.priority}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                priority: parseInt(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(complaint._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-500 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-slate-600 text-white px-4 py-2 rounded text-sm hover:bg-slate-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-blue-400 font-medium">
                          {complaint.category}
                        </span>
                        <span
                          className={`px-3 py-1 rounded text-sm ${getStatusColor(complaint.status)}`}
                        >
                          {complaint.status}
                        </span>
                        <span
                          className={`font-bold ${getPriorityColor(complaint.priority)}`}
                        >
                          Priority: {complaint.priority}
                        </span>
                      </div>
                      <p className="text-slate-300 mb-3">
                        {complaint.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>By: {complaint.userId?.name || 'Unknown'}</span>
                          <span>•</span>
                          <span>
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            Location: {complaint.latitude.toFixed(4)},{' '}
                            {complaint.longitude.toFixed(4)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEdit(complaint)}
                          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-500 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {complaint.imageUrl && (
                  <img
                    src={complaint.imageUrl}
                    alt="Complaint"
                    className="w-24 h-24 object-cover rounded ml-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
