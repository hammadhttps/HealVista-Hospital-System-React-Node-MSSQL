const express = require('express');
const {
  getAllMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controller/pharmacyController');

const router = express.Router();

router.get('/', getAllMedicines);         // GET all medicines
router.post('/', addMedicine);           // ADD a new medicine
router.put('/:id', updateMedicine);      // UPDATE a medicine
router.delete('/:id', deleteMedicine);   // DELETE a medicine

module.exports = router;
