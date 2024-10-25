const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Register a new user and send email verification
exports.register = async (req, res) => {
    console.log('Register function called');
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hashedPassword });

    // Save user in the database
    await user.save();

    // Create a verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;
    await sendVerificationEmail(user.email, verificationUrl);

    res.status(201).json({ message: 'User registered, please verify your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login a user and generate JWT token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Verify user email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and update the isVerified field
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error });
  }
};

// Reset password using one-time code
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, resetCode } = req.body;

    // Find the user
    const user = await User.findOne({ email, resetCode });
    if (!user) return res.status(400).json({ message: 'Invalid reset code' });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetCode = null; // Clear the reset code
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

// Send email verification
const sendVerificationEmail = async (email, url) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${url}`,
  };

  await transporter.sendMail(mailOptions);
};
