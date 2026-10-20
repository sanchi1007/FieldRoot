const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessagesWithUser,
  sendMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/messages/:otherUserId', protect, getMessagesWithUser);
router.post('/send', protect, sendMessage);

module.exports = router;
