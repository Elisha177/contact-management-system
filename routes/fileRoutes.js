const express = require('express');
const multer = require('multer');
const { uploadContacts, downloadContacts } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Setup Multer for file upload
const upload = multer({ dest: 'uploads/' });

// Route to upload contacts via CSV
router.post('/upload', authMiddleware, upload.single('file'), uploadContacts);

// Route to download contacts as CSV
router.get('/download', authMiddleware, downloadContacts);

module.exports = router;
