const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 3000; // Use environment variable for flexibility


// Middleware
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json());

// Import API routes
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const authRoutes = require('./routes/auth');

// Use routes with API endpoint prefixes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('Welcome to Task Manager API');
});

// Error Handling Middleware (Catches all unknown routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
