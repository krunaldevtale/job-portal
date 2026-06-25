const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Job description is required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ['fulltime', 'parttime', 'internship', 'contract'],
        default: 'fulltime'
    },
    salary: {
        type: String,
        default: 'Not disclosed'
    },
    skillRequired: [{
        type: String
    }],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                          // Links job to the recruiter who posted it
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema)