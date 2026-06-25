const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter'],
        default: 'candidate'
    },
    profile: {
        bio: { type: String, default: '' },
        skills: [{ type: String }],
        resume: { type: String, default: '' },  
        profilePhoto: { type: String, default: '' }
    }
}, { timestamps: true })  // Created At and Updated AT

module.exports = mongoose.model('User', userSchema)