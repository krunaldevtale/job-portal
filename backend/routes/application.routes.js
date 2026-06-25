const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
} = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');

//Candidate routes
router.post('/:jobId', protect, authorizeRoles('candidate'), applyToJob);
router.get('/my', protect, authorizeRoles('candidate'), getMyApplications);

// Recruiter routes
router.get('/job/:jobId', protect, authorizeRoles('recruiter'), getJobApplicants);
router.put('/:id', protect, authorizeRoles('recruiter'), updateApplicationStatus);

module.exports = router;