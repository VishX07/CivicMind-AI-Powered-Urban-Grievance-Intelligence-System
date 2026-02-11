/* eslint-disable no-unused-vars */
// src/pages/CreateComplaint.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateComplaint = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          setError('Unable to get location');
        },
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('address', address);
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('image', image);

      await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Complaint submitted successfully!');
      setDescription('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setImage(null);

      setTimeout(() => {
        navigate('/my-complaints');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-slate-100 mb-6">
          Create Complaint
        </h2>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
              minLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Problem Area / Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the location or address"
              required
              minLength={5}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <button
            type="button"
            onClick={getLocation}
            className="w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-600 transition-colors"
          >
            Get Current Location
          </button>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
