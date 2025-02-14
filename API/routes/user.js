const express = require('express');
const { userDb } = require('../couchdb'); // Import only user database
const bcrypt = require('bcryptjs');

const router = express.Router();

// ✅ Get all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await userDb.list({ include_docs: true });
    const users = rows.map(row => {
      const { password, ...userWithoutPassword } = row.doc; // Exclude password
      return userWithoutPassword;
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userDb.get(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// ✅ Create a new user
router.post('/', async (req, res) => {
  try {
    let { name, email, password } = req.body;
    
    // Hash the password before storing it
    password = await bcrypt.hash(password, 10);

    const newUser = { name, email, password };
    const response = await userDb.insert(newUser);
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update an existing user by ID
router.put('/:id', async (req, res) => {
  try {
    const existingUser = await userDb.get(req.params.id); // Get existing user
    const updatedUser = { ...existingUser, ...req.body }; // Merge updates
    const response = await userDb.insert(updatedUser);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await userDb.get(req.params.id); // Get user first
    const response = await userDb.destroy(user._id, user._rev); // Delete using _rev
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
