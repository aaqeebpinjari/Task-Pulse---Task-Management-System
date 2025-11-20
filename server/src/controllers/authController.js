const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// registering new user after checking duplicate email and returns a JWT token.

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

// Logs in a user by verifying email + password and returns JWT + user profile
const login = async (req, res, next) => 
  {
      try 
      {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
          const error = new Error('Invalid credentials');
          error.statusCode = 401;
          throw error;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          const error = new Error('Invalid credentials');
          error.statusCode = 401;
          throw error;
        }

        const token = generateToken(user._id);
        res.json({ success: true, token, user: user.toJSON() });
      } 
      catch (error)
      {
        next(error);
      }
};

// Returns the authenticated user's profile using the identity decoded from JWT.
const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};

