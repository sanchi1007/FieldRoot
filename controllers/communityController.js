const Question = require('../models/Question');

/**
 * @desc    Get all community questions
 * @route   GET /api/community
 * @access  Public
 */
exports.getQuestions = async (req, res) => {
  try {
    const { category, cropName, search } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (cropName) {
      query.cropName = new RegExp(cropName, 'i');
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { cropName: new RegExp(search, 'i') }
      ];
    }

    const questions = await Question.find(query)
      .populate('author', 'name village state role avatar')
      .populate('answers.author', 'name role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single question with all answers
 * @route   GET /api/community/:id
 * @access  Public
 */
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name village district state role avatar')
      .populate('answers.author', 'name village state role avatar');

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.views = (question.views || 0) + 1;
    await question.save();

    res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Ask a new question
 * @route   POST /api/community
 * @access  Private
 */
exports.createQuestion = async (req, res) => {
  try {
    const { title, content, category, cropName } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide question title and details'
      });
    }

    const question = await Question.create({
      author: req.user.id,
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      cropName: cropName || ''
    });

    const populated = await Question.findById(question._id).populate(
      'author',
      'name village state role avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Question posted to community board',
      question: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Answer a question
 * @route   POST /api/community/:id/answer
 * @access  Private
 */
exports.answerQuestion = async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (!content) {
      return res.status(400).json({ success: false, message: 'Please provide your answer' });
    }

    const isExpert = req.user.role === 'admin' || req.user.role === 'company';

    const newAnswer = {
      author: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      content: content.trim(),
      isExpertAnswer: isExpert,
      upvotes: []
    };

    question.answers.push(newAnswer);
    await question.save();

    const populated = await Question.findById(question._id)
      .populate('author', 'name village state role avatar')
      .populate('answers.author', 'name village state role avatar');

    res.status(201).json({
      success: true,
      message: 'Answer posted successfully',
      question: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Upvote a question
 * @route   POST /api/community/:id/upvote
 * @access  Private
 */
exports.upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const userId = req.user.id;
    const alreadyUpvoted = question.upvotes.includes(userId);

    if (alreadyUpvoted) {
      question.upvotes = question.upvotes.filter((u) => u.toString() !== userId);
    } else {
      question.upvotes.push(userId);
    }

    await question.save();

    res.status(200).json({
      success: true,
      upvoted: !alreadyUpvoted,
      upvotesCount: question.upvotes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
