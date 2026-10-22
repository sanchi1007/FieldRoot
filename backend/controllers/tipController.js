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

    let tips = [];
    try {
      tips = await Tip.find(query).sort('-createdAt');
    } catch (dbErr) {
      console.warn('MongoDB tips query unavailable, using fallback farming tips:', dbErr.message);
      tips = getFallbackTips({ category, search });
    }

    if (tips.length === 0 && (!category && !search)) {
      tips = getFallbackTips({});
    }

    res.status(200).json({
      success: true,
      count: tips.length,
      tips
    });
  } catch (error) {
    const fallback = getFallbackTips({});
    res.status(200).json({
      success: true,
      count: fallback.length,
      tips: fallback
    });
  }
};

function getFallbackTips({ category, search }) {
  const list = [
    {
      _id: 'tip_01',
      title: 'Making Potent Jeevamrutha for High-Saponin Reetha & Shikakai',
      category: 'composting',
      summary: 'Enrich soil microbiome naturally with indigenous cow dung, urine, jaggery, and pulse flour.',
      imageUrl: '/images/tip_jeevamrutha.jpg',
      author: 'FieldRoot Organic Advisory Board',
      tags: ['ZBNF', 'Soil Health', 'Reetha', 'Shikakai']
    },
    {
      _id: 'tip_02',
      title: 'FieldRoot Botanical Quality Guide: Understanding Grades A, B & C',
      category: 'quality_grades',
      summary: 'Learn what cosmetic chemists test in your harvest to qualify for premium Grade A pricing.',
      imageUrl: '/images/tip_quality.jpg',
      author: 'Dr. Aruna Joshi (FieldRoot Quality Director)',
      tags: ['Quality Grades', 'Ayurvedic Testing', 'Pricing', 'Moisture Standards']
    },
    {
      _id: 'tip_03',
      title: 'Natural Pest Spray: Making 5-Leaf Extract (Panchaparni Kashayam)',
      category: 'pest_control',
      summary: 'Protect leaves from aphids, mites, and leaf miners without synthetic chemicals using locally available bitter herbs.',
      imageUrl: '/images/tip_pest.jpg',
      author: 'Rameshwar Patil (Master Organic Farmer)',
      tags: ['Pest Control', 'Neem Spray', 'Chemical Free', 'Leaves Protection']
    },
    {
      _id: 'tip_04',
      title: 'Solar Dehydration & Herbal Storage to Prevent Aflatoxins',
      category: 'drying_and_storage',
      summary: 'How to shade-dry flowers and roots to retain rich color and avoid mold during monsoons.',
      imageUrl: '/images/tip_drying.jpg',
      author: 'Vikramaditya Shinde (Procurement Head)',
      tags: ['Post-Harvest', 'Shade Drying', 'Storage', 'No Mold']
    }
  ];

  return list.filter((t) => {
    if (category && category !== 'all' && t.category.toLowerCase() !== category.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q) || (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });
}

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
