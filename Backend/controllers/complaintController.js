// controllers/complaintController.js
import Complaint from '../models/Complaint.js';
import uploadToCloudinary from '../utils/cloudinaryUpload.js';
import callAIService from '../utils/aiService.js';
import { io } from '../server.js';

export const createComplaint = async (req, res) => {
  try {
    const { description, latitude, longitude, address } = req.body;

    if (!description || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description, latitude, and longitude',
      });
    }

    if (description.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters',
      });
    }

    if (address && address.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Address must be at least 5 characters',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const complaint = await Complaint.create({
      userId: req.user.id,
      description,
      imageUrl,
      latitude,
      longitude,
      address: address || '',
      status: 'processing',
    });

    const aiResult = await callAIService(description, imageUrl);

    complaint.category = aiResult.category;
    complaint.priority = aiResult.priority;
    complaint.status = 'open';

    await complaint.save();

    // Populate userId before emitting
    await complaint.populate('userId', 'name email phone');

    // Emit real-time update to all connected clients
    io.emit('newComplaint', complaint);

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    // const complaint = await Complaint.findById(req.params.id);

    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
