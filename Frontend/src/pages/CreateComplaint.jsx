/* eslint-disable no-unused-vars */
// src/pages/CreateComplaint.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  AiOutlineEnvironment,
  AiOutlineCamera,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineLoading,
} from 'react-icons/ai';

const CreateComplaint = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getLocation = () => {
    setGettingLocation(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setGettingLocation(false);
        },
        (error) => {
          setError('Unable to get location. Please enable location services.');
          setGettingLocation(false);
        },
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
      if (image) {
        formData.append('image', image);
      }

      await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Complaint submitted successfully!');

      // Reset form
      setDescription('');
      setAddress('');
      setLatitude('');
      setLongitude('');
      setImage(null);
      setImagePreview(null);

      // Navigate after 2 seconds
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Create New Complaint
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Report a civic issue and help improve your city
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-slide-down">
            <AiOutlineCloseCircle size={24} className="flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {success && (
          <div className="backdrop-blur-xl bg-green-500/20 border border-green-500/40 text-green-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-slide-down">
            <AiOutlineCheckCircle size={24} className="flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm sm:text-base">{success}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-6"
        >
          {/* Description */}
          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">
              Complaint Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
              rows="5"
              placeholder="Describe the issue in detail..."
              required
              minLength={10}
            />
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Minimum 10 characters
            </p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">
              Problem Area / Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              placeholder="Enter the location or address"
              required
              minLength={5}
            />
          </div>

          {/* Location Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="0.0000"
                required
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-3 sm:py-4 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="0.0000"
                required
              />
            </div>
          </div>

          {/* Get Location Button */}
          <button
            type="button"
            onClick={getLocation}
            disabled={gettingLocation}
            className="w-full flex items-center justify-center gap-2 bg-white/10 border-2 border-white/20 text-white px-4 py-3 sm:py-4 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {gettingLocation ? (
              <>
                <AiOutlineLoading size={20} className="animate-spin" />
                <span>Getting Location...</span>
              </>
            ) : (
              <>
                <AiOutlineEnvironment size={20} />
                <span>Get Current Location</span>
              </>
            )}
          </button>

          {/* Image Upload */}
          <div>
            <label className="block text-sm sm:text-base font-semibold mb-2 sm:mb-3 text-white">
              Upload Image *
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 sm:h-64 object-cover rounded-xl border-2 border-white/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                >
                  <AiOutlineCloseCircle size={20} />
                </button>
              </div>
            )}

            {/* File Input */}
            <label className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
              <div className="flex flex-col items-center justify-center py-6">
                <AiOutlineCamera size={48} className="text-slate-400 mb-4" />
                <p className="text-sm sm:text-base text-slate-300 font-medium mb-1">
                  {image ? 'Change Image' : 'Click to upload image'}
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  PNG, JPG up to 10MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required={!image}
              />
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 sm:py-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <AiOutlineLoading size={20} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <AiOutlineCheckCircle size={20} />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
              className="flex-1 bg-white/10 border-2 border-white/20 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/20 hover:border-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 mt-6 text-slate-300 text-xs sm:text-sm">
          <h4 className="font-semibold text-white mb-2">
            📌 Tips for better complaints:
          </h4>
          <ul className="space-y-1 list-disc list-inside">
            <li>Provide clear and detailed description</li>
            <li>Include exact location or nearby landmarks</li>
            <li>Upload a clear photo of the issue</li>
            <li>Enable location services for accurate coordinates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
