const express = require('express');
const { protectRoute } = require('../middleware/auth.js');
const { getUsersForSidebar, getMessages, markMessageAsSeen } = require('../controllers/messageController.js');

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.patch('/:id/seen', protectRoute, markMessageAsSeen);

module.exports = router;
