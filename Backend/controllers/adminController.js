// controllers/adminController.js
import Complaint from '../models/Complaint.js';

export const getAllComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email phone')
      .sort({ priority: -1, createdAt: -1 });

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

export const updateComplaint = async (req, res) => {
  try {
    const { status, category, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const validCategories = [
      'Waste Management',
      'Water Supply',
      'Road Damage',
      'Streetlights',
      'Sanitation',
      'Others',
    ];
    const validStatuses = ['processing', 'open', 'in-progress', 'resolved'];

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }
      complaint.status = status;
    }

    if (category) {
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category',
        });
      }
      complaint.category = category;
    }

    if (priority !== undefined) {
      complaint.priority = Math.min(Math.max(priority, 0), 10);
    }

    await complaint.save();

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
