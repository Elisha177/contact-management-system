const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://elishaebe177:ZG8SfU496ESlfMcC@contact-management-db.vredg.mongodb.net/contact-management-db?retryWrites=true&w=majority'
    );
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
