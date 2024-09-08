const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing
const saltRounds = 10; // Number of salt rounds
const jwt = require('jsonwebtoken'); // For token-based authentication
const User = require('../models/User'); // Ensure this path is correct

// Registration route
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password before hashing:', password);
    console.log('Hashed password:', hashedPassword);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ token, firstName: user.firstName }); // Send first name with token
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
