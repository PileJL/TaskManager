const express = require('express');
const { taskDb } = require('../couchdb'); // Import only task database
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// ✅ Get all tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await taskDb.list({ include_docs: true });
    res.json(rows.map(row => row.doc));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get a single task by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await taskDb.get(req.params.id);
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

  // ✅ Get tasks by user_id
  router.get('/user/:userId', authMiddleware, async (req, res) => {
      try {
        const { rows } = await taskDb.list({ include_docs: true });
    
        // Filter tasks that belong to the given userId
        const userTasks = rows
          .map(row => row.doc)
          .filter(task => task.user_id === req.params.userId);
    
        res.json(userTasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  

// ✅ Create a new task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;

    const newTask = {
      title,
      description,
      dueDate,
      completed: completed ?? false, // ✅ Ensure 'completed' is always present
      user_id: req.user.id // Auto-assign user_id
    };

    const response = await taskDb.insert(newTask);
    res.status(201).json({ ...newTask, _id: response.id, _rev: response.rev });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  


// ✅ Update an existing task by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const existingTask = await taskDb.get(req.params.id); // Get existing task
    const updatedTask = { ...existingTask, ...req.body }; // Merge updates
    const response = await taskDb.insert(updatedTask);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a task by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await taskDb.get(req.params.id); // Get task first
    const response = await taskDb.destroy(task._id, task._rev); // Delete using _rev
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark a task as complete
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const task = await taskDb.get(req.params.id); // Get the task by ID
    task.completed = true; // Update the completed status

    const response = await taskDb.insert(task); // Save the updated task
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
