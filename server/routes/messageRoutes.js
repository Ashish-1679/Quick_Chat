const express = require('express');
const { protectRoute } = require('../middleware/auth.js');
const { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage } = require('../controllers/messageController.js');

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.patch('/mark/:id', protectRoute, markMessageAsSeen);
router.post("/send/:id",protectRoute,sendMessage);

module.exports = router;
