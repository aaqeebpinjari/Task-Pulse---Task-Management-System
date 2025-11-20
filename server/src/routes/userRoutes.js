const express = require('express');
const auth = require('../middleware/auth');
const { listUsers } = require('../controllers/userController');

const router = express.Router();

// @route GET /users → List all users (used for assigning tasks)
router.get('/', auth, listUsers);

module.exports = router;

