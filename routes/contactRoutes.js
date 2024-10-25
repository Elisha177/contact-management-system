const express = require('express');
const { addContact } = require('../controllers/contactController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/contacts', authMiddleware, addContact);

module.exports = router;
