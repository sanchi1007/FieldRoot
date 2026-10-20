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

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, createQuestion);
router.post('/:id/answer', protect, answerQuestion);
router.post('/:id/upvote', protect, upvoteQuestion);

module.exports = router;
