const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const { transformDriveUrl } = require('../utils/googleDrive');
const { parseMonthYear } = require('../utils/dateUtils');

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ sortDate: -1, createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new certificate
router.post('/', async (req, res) => {
  try {
    if (req.body.imageUrl) {
      req.body.imageUrl = transformDriveUrl(req.body.imageUrl);
    }
    if (req.body.date) {
      req.body.sortDate = parseMonthYear(req.body.date);
    }
    const certificate = new Certificate(req.body);
    const newCert = await certificate.save();
    res.status(201).json(newCert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update certificate
router.put('/:id', async (req, res) => {
  try {
    if (req.body.imageUrl) {
      req.body.imageUrl = transformDriveUrl(req.body.imageUrl);
    }
    if (req.body.date) {
      req.body.sortDate = parseMonthYear(req.body.date);
    }
    const updatedCert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
