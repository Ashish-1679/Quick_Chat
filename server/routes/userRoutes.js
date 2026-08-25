const express = require('express');
const { signup, login, updateProfile } = require('../controllers/userController.js');
const { protectRoute, checkAuth } = require('../middleware/auth.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);

module.exports = router;