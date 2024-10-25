const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const cors = require("cors")
// Initialize express app
const app = express();

// Load environment variables
dotenv.config();

// Connect to the database
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(express.json());
app.use(cors());

//  routes 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));

app.post('/test', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Received' });
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app