const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userDb } = require('../couchdb');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const { rows } = await userDb.list({ include_docs: true });
    if (rows.some(row => row.doc.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user in CouchDB
    const newUser = { name, email, password: hashedPassword };
    const response = await userDb.insert(newUser);
    
    res.status(201).json({ message: 'User registered successfully', userId: response.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve users
    const { rows } = await userDb.list({ include_docs: true });
    const user = rows.map(row => row.doc).find(doc => doc.email === email);

    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
