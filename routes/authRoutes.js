const express = require('express');
const { register, login, verifyEmail, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for email verification
router.get('/verify/:token', verifyEmail);

// Route for password reset
router.post('/reset-password', resetPassword);

module.exports = router;
