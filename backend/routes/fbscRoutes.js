const express = require('express');
const router = express.Router();
const fbscController = require('../controllers/fbscController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Create new record
router.post('/records', fbscController.createRecord);

// Get all records with filters
router.get('/records', fbscController.getRecords);

// Get single record
router.get('/records/:id', fbscController.getRecordById);

// Update record
router.put('/records/:id', fbscController.updateRecord);

// Delete record
router.delete('/records/:id', fbscController.deleteRecord);

// Get statistics
router.get('/stats', fbscController.getStats);

// Get unique products
router.get('/products', fbscController.getProducts);

module.exports = router;