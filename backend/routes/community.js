const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  answerQuestion,
  upvoteQuestion
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/security');

router.get('/', getQuestions);
router.get('/:id', validateObjectId('id'), getQuestionById);
router.post('/', protect, createQuestion);
router.post('/:id/answer', protect, validateObjectId('id'), answerQuestion);
router.post('/:id/upvote', protect, validateObjectId('id'), upvoteQuestion);

module.exports = router;
