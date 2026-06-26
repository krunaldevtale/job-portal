const Application = require('../models/Application.model');
const Job = require("../models/Job.model");

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)

const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        })
        if (existingApplication) {
            return res.status(400).json({ message: 'You already applied to this job' })
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            coverLetter
        })

        res.status(201).json({ success: true, application })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get logged in candidate's applications
// @route   GET /api/applications/my
// @access  Private (Candidate only)

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id }).populate('job', 'title company location salary').sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: applications.length, applications })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get all applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter who posted the job only)
const getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params

        // Check job exists and belongs to this recruiter
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view these applicants' })
        }

        const applications = await Application.find({ job: jobId })
            .populate('applicant', 'name email profile')
            .sort({ createdAt: -1 })

        res.status(200).json({ success: true, count: applications.length, applications })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:id
// @access  Private (Recruiter who posted the job only)

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;  // expected: "accepted" or "rejected"

        const application = await Application.findById(req.params.id).populate('job');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' })
        }

        // Check that the logged in recruiter owns the job
        if (application.job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this application' })
        }

        application.status = status
        await application.save()

        res.status(200).json({ success: true, application })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus };