const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, updateJob, deleteJob } = require('../controllers/job.controller');
const { protect } = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

//Public Routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes (recruiter only)
router.post('/', protect, authorizeRoles('recruiter'), createJob)
router.put('/:id', protect, authorizeRoles('recruiter'), updateJob)
router.delete('/:id', protect, authorizeRoles('recruiter'), deleteJob)

module.exports = router;