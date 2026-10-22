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

    let questions = [];
    try {
      questions = await Question.find(query)
        .populate('author', 'name village state role avatar')
        .populate('answers.author', 'name role')
        .sort('-createdAt');
    } catch (dbErr) {
      console.warn('MongoDB community query unavailable, using fallback questions:', dbErr.message);
      questions = getDemoQuestionsFallback({ category, search, cropName });
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: 0,
      questions: getDemoQuestionsFallback({})
    });
  }
};

function getDemoQuestionsFallback({ category, search, cropName }) {
  const fallback = [
    {
      _id: 'q_hibiscus_01',
      title: 'How to preserve the deep crimson red color of Hibiscus petals after harvest?',
      category: 'Harvesting & Drying',
      cropName: 'Hibiscus',
      content: 'Whenever we harvest Hibiscus petals in Satara, they turn dark purplish or blackish within 2 days of drying. What drying technique preserves the bright cosmetic crimson shade FieldRoot requires for hair shampoos?',
      createdAt: new Date('2026-09-15').toISOString(),
      author: {
        name: 'Rameshwar Patil',
        village: 'Koregaon',
        state: 'Maharashtra',
        role: 'farmer'
      },
      upvotes: ['user_01', 'user_02', 'user_03', 'user_04'],
      answers: [
        {
          authorName: 'Dr. Aruna Joshi (FieldRoot Quality Director)',
          isExpertAnswer: true,
          createdAt: new Date('2026-09-16').toISOString(),
          content: 'Never sun-bake fresh Hibiscus in direct midday heat! Anthocyanin flavonoids decompose above 45°C. Elevate petals on nylon mesh racks under 50% green agro-shade nets with high cross-ventilation.'
        },
        {
          authorName: 'Murugan Sundaram',
          isExpertAnswer: false,
          createdAt: new Date('2026-09-17').toISOString(),
          content: 'We practice this in Salem: harvest only between 6 AM and 8:30 AM before dew completely evaporates. Petals stay soft and retain full crimson tone!'
        }
      ]
    },
    {
      _id: 'q_reetha_02',
      title: 'Preventing mold on Reetha (Soapnut) during cloudy winter days?',
      category: 'Harvesting & Drying',
      cropName: 'Reetha',
      content: 'In winter mornings we get heavy mist. What moisture level is safe before packing Reetha shells for FieldRoot dispatch?',
      createdAt: new Date('2026-09-18').toISOString(),
      author: {
        name: 'Jignesh Patel',
        village: 'Keshod',
        state: 'Gujarat',
        role: 'farmer'
      },
      upvotes: ['user_01', 'user_02'],
      answers: [
        {
          authorName: 'Vikramaditya Shinde (Procurement Head)',
          isExpertAnswer: true,
          createdAt: new Date('2026-09-19').toISOString(),
          content: 'Keep moisture below 10%. Pack with food-grade silica gel pouches in HDPE bags. FieldRoot quality testing checks moisture on arrival at Hadapsar hub.'
        }
      ]
    },
    {
      _id: 'q_shikakai_03',
      title: 'Best natural bio-fertilizer for high-yield Shikakai pods?',
      category: 'Crops & Sowing',
      cropName: 'Shikakai',
      content: 'Which organic compost gives maximum pod thickness and saponin content without using chemical DAP or urea?',
      createdAt: new Date('2026-09-20').toISOString(),
      author: {
        name: 'Rameshwar Patil',
        village: 'Koregaon',
        state: 'Maharashtra',
        role: 'farmer'
      },
      upvotes: ['user_01', 'user_02', 'user_03'],
      answers: [
        {
          authorName: 'FieldRoot Agronomist Team',
          isExpertAnswer: true,
          createdAt: new Date('2026-09-21').toISOString(),
          content: 'Apply Jeevamrutha (200L/acre) twice a month mixed with rock phosphate and neem cake. This enhances pod girth and active saponins naturally.'
        }
      ]
    }
  ];

  return fallback.filter((q) => {
    if (category && category !== 'all' && q.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (cropName && q.cropName && !q.cropName.toLowerCase().includes(cropName.toLowerCase())) {
      return false;
    }
    if (search) {
      const s = search.toLowerCase();
      const match =
        q.title.toLowerCase().includes(s) ||
        q.content.toLowerCase().includes(s) ||
        (q.cropName && q.cropName.toLowerCase().includes(s));
      if (!match) return false;
    }
    return true;
  });
}

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
    const alreadyUpvoted = question.upvotes.some((u) => u.toString() === userId);

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
