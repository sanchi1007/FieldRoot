const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessagesWithUser,
  sendMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/security');

router.get('/conversations', protect, getConversations);
router.get('/messages/:otherUserId', protect, validateObjectId('otherUserId'), getMessagesWithUser);
router.post('/send', protect, sendMessage);

module.exports = router;
