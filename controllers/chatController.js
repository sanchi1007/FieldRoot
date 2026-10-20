const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc    Get all conversations for logged in user
 * @route   GET /api/chat/conversations
 * @access  Private
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name role avatar')
      .populate('recipient', 'name role avatar')
      .populate('product', 'name images')
      .sort('-createdAt');

    // Group into conversations by the other party
    const conversationMap = {};

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId ? msg.recipient : msg.sender;
      if (!otherUser) return;

      const otherId = otherUser._id.toString();
      if (!conversationMap[otherId]) {
        conversationMap[otherId] = {
          contact: {
            id: otherUser._id,
            name: otherUser.name,
            role: otherUser.role,
            avatar: otherUser.avatar
          },
          lastMessage: {
            text: msg.text,
            createdAt: msg.createdAt,
            senderId: msg.sender._id
          },
          unreadCount: 0
        };
      }

      if (msg.recipient._id.toString() === userId && !msg.read) {
        conversationMap[otherId].unreadCount += 1;
      }
    });

    res.status(200).json({
      success: true,
      conversations: Object.values(conversationMap)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get messages between current user and another user
 * @route   GET /api/chat/messages/:otherUserId
 * @access  Private
 */
exports.getMessagesWithUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
      .populate('sender', 'name role avatar')
      .populate('recipient', 'name role avatar')
      .populate('product', 'name images pricePerUnit unit')
      .sort('createdAt');

    // Mark messages from other user as read
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { read: true }
    );

    const contactUser = await User.findById(otherUserId).select(
      'name role phone village district state companyDetails trustScore'
    );

    res.status(200).json({
      success: true,
      contact: contactUser,
      messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Send a message
 * @route   POST /api/chat/send
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text, productId, orderId } = req.body;

    if (!recipientId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipientId and message text'
      });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      text: text.trim(),
      product: productId || undefined,
      order: orderId || undefined
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name role avatar')
      .populate('recipient', 'name role avatar')
      .populate('product', 'name images');

    res.status(201).json({
      success: true,
      message: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
