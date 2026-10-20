const Tip = require('../models/Tip');

/**
 * @desc    Get all organic farming guides & quality grading guides
 * @route   GET /api/tips
 * @access  Public
 */
exports.getTips = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { summary: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const tips = await Tip.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tips.length,
      tips
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single tip by ID and increment views
 * @route   GET /api/tips/:id
 * @access  Public
 */
exports.getTipById = async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({ success: false, message: 'Guide not found' });
    }

    tip.views = (tip.views || 0) + 1;
    await tip.save();

    res.status(200).json({
      success: true,
      tip
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new farming tip or quality standard
 * @route   POST /api/tips
 * @access  Private (Admin / Agronomist)
 */
exports.createTip = async (req, res) => {
  try {
    const { title, category, summary, content, steps, tags, imageUrl } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, summary, and content'
      });
    }

    const tip = await Tip.create({
      title: title.trim(),
      category,
      summary: summary.trim(),
      content: content.trim(),
      steps: steps || [],
      tags: tags || [],
      imageUrl: imageUrl || '/images/placeholder_guide.jpg',
      author: req.user.name || 'FieldRoot Agronomy Team'
    });

    res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      tip
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
