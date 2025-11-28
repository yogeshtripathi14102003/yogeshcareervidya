// models/University.js

import mongoose from 'mongoose'; // 👈 changed

// Helper Schemas for repeated structures
const ApprovalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String, default: null }
});

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: String, default: 'N/A' },
    logo: { type: String, default: null }
});

const UniversitySchema = new mongoose.Schema({
    // ... (rest of the schema remains the same)
    // ...
    approvals: { type: [ApprovalSchema], default: [] },
    recognition: {
        recognitionHeading: { type: String, default: 'Recognition' },
        recognitionDescription: { type: String, default: '' },
        recognitionPoints: { type: [String], default: [] },
        certificateImage: { type: String, default: null }
    },
    admission: {
        admissionHeading: { type: String, default: 'Admission Process' },
        admissionSubHeading: { type: String, default: '' },
        admissionDescription: { type: String, default: '' },
        admissionPoints: { type: [String], default: [] }
    },
    courses: { type: [CourseSchema], default: [] }
}, { timestamps: true });

const University = mongoose.model('University', UniversitySchema);

export default University; // 👈 changed