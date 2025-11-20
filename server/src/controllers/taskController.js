const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

// Converts a Mongoose task document into a plain JSON object for safe socket emission.
const sanitizeTask = (task) => {
  if (task && typeof task.toJSON === 'function') {
    return task.toJSON();
  }
  return task;
};

// Emits real-time task events (create/update/delete) to all connected Socket.io clients.
const emitTaskEvent = (req, payload) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('tasks:update', {
      ...payload,
      task: sanitizeTask(payload.task),
    });
  }
};

// Builds a query filter allowing a user to access tasks they created or are assigned to.
const buildAccessFilter = (userId) => ({
  $or: [{ createdBy: userId }, { assignedTo: userId }],
});

// Fetches paginated, filterable, and sortable tasks for the logged-in user.
const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      assignedTo,
    } = req.query;

    const sortableFields = ['createdAt', 'dueDate', 'priority', 'status', 'title'];
    const resolvedSortBy = sortableFields.includes(sortBy) ? sortBy : 'createdAt';

    const filter = buildAccessFilter(req.user._id);

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      filter.assignedTo = assignedTo;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const resolvedPage = Number(page) || 1;
    const resolvedLimit = Math.min(Number(limit) || 10, 50);
    const skip = (resolvedPage - 1) * resolvedLimit;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ [resolvedSortBy]: sortDirection })
        .skip(skip)
        .limit(resolvedLimit),
      Task.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tasks,
      meta: {
        total,
        page: resolvedPage,
        limit: resolvedLimit,
        pages: Math.ceil(total / resolvedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Fetches a single task and checks if the user is authorized to view it.

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      throw err;
    }

    // Ensures only creator or assigned user can view the task.
    const isAuthorized =
      task.createdBy._id.equals(req.user._id) ||
      (task.assignedTo && task.assignedTo._id.equals(req.user._id));

    if (!isAuthorized) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// Creates a new task, validates assigned user, and broadcasts the creation event.
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags, assignedTo } = req.body;

    let assignedUser = null;
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        const err = new Error('Invalid assigned user');
        err.statusCode = 400;
        throw err;
      }
      assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        const err = new Error('Assigned user not found');
        err.statusCode = 404;
        throw err;
      }
    }
// Updates a task if the logged-in user is its creator and pushes a real-time update event.
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      assignedTo: assignedUser ? assignedUser._id : undefined,
      createdBy: req.user._id,
    });

    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');
    const populatedTask = task;

    emitTaskEvent(req, { action: 'created', task: populatedTask });
    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      throw err;
    }

    // Only the user who created the task can modify it.
    if (!task.createdBy.equals(req.user._id)) {
      const err = new Error('Only the creator can update this task');
      err.statusCode = 403;
      throw err;
    }

    const updatableFields = ['title', 'description', 'status', 'priority', 'dueDate', 'tags'];
    updatableFields.forEach((field) => {
      if (field in req.body) {
        task[field] = req.body[field];
      }
    });

    if (req.body.assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(req.body.assignedTo)) {
        const err = new Error('Invalid assigned user');
        err.statusCode = 400;
        throw err;
      }
      const assignedUser = await User.findById(req.body.assignedTo);
      if (!assignedUser) {
        const err = new Error('Assigned user not found');
        err.statusCode = 404;
        throw err;
      }
      task.assignedTo = assignedUser._id;
    } else if (req.body.assignedTo === null) {
      task.assignedTo = undefined;
    }

    const updatedTask = await task.save();
    await updatedTask.populate('assignedTo', 'name email');
    await updatedTask.populate('createdBy', 'name email');
    const populatedTask = updatedTask;

    emitTaskEvent(req, { action: 'updated', task: populatedTask });
    res.json({ success: true, data: populatedTask });
  } catch (error) {
    next(error);
  }
};

// Deletes a task if the user is the creator and notifies clients in real-time.
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      throw err;
    }

    if (!task.createdBy.equals(req.user._id)) {
      const err = new Error('Only the creator can delete this task');
      err.statusCode = 403;
      throw err;
    }

    await task.deleteOne();
    emitTaskEvent(req, { action: 'deleted', taskId: task._id });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

const getTaskStats = async (req, res, next) => {
  try {
    const baseFilter = buildAccessFilter(req.user._id);
    const total = await Task.countDocuments(baseFilter);
    const completed = await Task.countDocuments({ ...baseFilter, status: 'completed' });
    const pending = await Task.countDocuments({ ...baseFilter, status: 'pending' });
    const inProgress = await Task.countDocuments({ ...baseFilter, status: 'in-progress' });

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};

