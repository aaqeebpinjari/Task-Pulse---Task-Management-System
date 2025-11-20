const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { getTasks,getTask,createTask,updateTask,deleteTask,getTaskStats,} = require('../controllers/taskController');

const router = express.Router();
// Apply authentication middleware to all routes below
router.use(auth);

// @route GET /tasks → Get all tasks with filters
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTask);

const optionalTaskValidation = [
  body('description').optional().isString(),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().toDate(),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
  body('tags.*').optional().isString().withMessage('Each tag must be a string'),
  body('assignedTo').optional({ nullable: true }).isString().withMessage('assignedTo must be a user id'),
];

// @route POST /tasks → Create new task
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    ...optionalTaskValidation,
  ],
  validateRequest,
  createTask,
);


// @route PUT /tasks/:id → Update existing task
router.put(
  '/:id',
  [body('title').optional().notEmpty().withMessage('Title is required'), ...optionalTaskValidation],
  validateRequest,
  updateTask,
);

// @route PUT /tasks/:id → delete existing task
router.delete('/:id', deleteTask);

module.exports = router;

