const Job = require('../models/Job.model');

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter only)

const createJob = async (req, res) => {
    try {
        const { title, company, description, location, type, salary, skillsRequired } = req.body;

        const job = await Job.create({
            title,
            company,
            description,
            location,
            type,
            salary,
            skillsRequired,
            postedBy: req.user.id      // comes from protect middleware
        })

        res.status(201).json({ success: true, job })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get all jobs (with optional filters)
// @route   GET /api/jobs
// @access  Public

const getJobs = async (req, res) => {
    try {
        const { location, type, search } = req.query;

        let filter = {}
        if (location) filter.location = { $regex: location, $options: 'i' };  // case insensitive
        if (type) filter.type = type;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const jobs = await Job.find(filter).populate('postedBy', 'name email').sort({ createdAt: -1 })  // newest first

        res.status(200).json({ success: true, count: jobs.length, jobs })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name email');

        if (!job) {
            return res.status(404).json({message: 'Job not found'})
        }

        res.status(200).json({ success: true, job })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter who posted it only)

const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        // Check if logged in user is the one who posted this job
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this job' })
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,              // return updated document
            runValidators: true     // run schema validations on update
        })

        res.status(200).json({ success: true, job })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter who posted it only)

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' })
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this job' })
        }

        await Job.findByIdAndDelete(req.params.id)

        res.status(200).json({ success: true, message: 'Job deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createJob, getJobs, getJobById, updateJob, deleteJob };
