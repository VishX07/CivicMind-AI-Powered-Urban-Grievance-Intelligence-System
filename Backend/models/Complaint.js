// // models/Complaint.js
// import mongoose from 'mongoose';

// const complaintSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 10,
//       maxlength: 1000,
//     },
//     imageUrl: {
//       type: String,
//       default: '',
//     },
//     latitude: {
//       type: Number,
//       required: true,
//       min: -90,
//       max: 90,
//     },
//     longitude: {
//       type: Number,
//       required: true,
//       min: -180,
//       max: 180,
//     },
//     category: {
//       type: String,
//       enum: [
//         'Waste Management',
//         'Water Supply',
//         'Road Damage',
//         'Streetlights',
//         'Sanitation',
//         'Others',
//       ],
//       default: 'Others',
//     },
//     priority: {
//       type: Number,
//       min: 0,
//       max: 10,
//       default: 1,
//     },
//     status: {
//       type: String,
//       enum: ['processing', 'open', 'in-progress', 'resolved'],
//       default: 'open',
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// complaintSchema.index({ userId: 1 });
// complaintSchema.index({ category: 1 });
// complaintSchema.index({ status: 1 });
// complaintSchema.index({ priority: -1 });

// export default mongoose.model('Complaint', complaintSchema);

// models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    // category: {
    //   type: String,
    //   enum: [
    //     'Waste Management',
    //     'Water Supply',
    //     'Road Damage',
    //     'Streetlights',
    //     'Sanitation',
    //     'Others',
    //   ],
    //   default: 'Others',
    // },

    category: {
      type: String,
      enum: [
        'Waste Management',
        'Water Supply',
        'Road Damage',
        'Streetlights',
        'Sanitation',
        'Others',

        // New Categories
        'Public Property Damage',
        'Electricity Issue',
        'Illegal Construction',
        'Drainage Issue',
        'Street Lights',
        'Garbage Collection',
        'Encroachment',
        'Noise Pollution',
        'Stray Animals',
        'Tree Related',
      ],
      default: 'Others',
    },

    priority: {
      type: Number,
      min: 0,
      max: 10,
      default: 1,
    },
    status: {
      type: String,
      enum: ['processing', 'open', 'in-progress', 'resolved'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  },
);

complaintSchema.index({ userId: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: -1 });

export default mongoose.model('Complaint', complaintSchema);
