// src/pages/MyComplaints.jsx (REMOVE Navbar import and component)
import { useState, useEffect } from 'react';
import api from '../services/api';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints/my');
      setComplaints(data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-slate-100 mb-6">My Complaints</h2>

      {loading ? (
        <div className="text-center text-slate-300">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center text-slate-300">
          No complaints found
        </div>
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-blue-400 font-medium">
                    {complaint.category}
                  </span>
                  <p className="text-slate-300 mt-2">{complaint.description}</p>
                </div>
                <span className="bg-slate-700 px-3 py-1 rounded text-sm text-slate-300">
                  {complaint.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>Priority: {complaint.priority}</span>
                <span>•</span>
                <span>
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
