const User = require('../models/User');

// Returns list of all users (name + email only) for task assignment dropdown.
const listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select('name email');
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers };

