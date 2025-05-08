const express = require('express');
const {
    getAllDoctors,
    getDoctorById,
    getDoctorAvailability
} = require('../controller/doctorController');

const router = express.Router();

router.get('/', getAllDoctors);                   // GET all doctors
router.get('/:id', getDoctorById);                // GET doctor by ID
router.get('/:id/availability', getDoctorAvailability); // GET doctor availability

module.exports = router;