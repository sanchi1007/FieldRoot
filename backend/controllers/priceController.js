const PriceRecord = require('../models/PriceRecord');

/**
 * @desc    Get Mandi price records with filters
 * @route   GET /api/prices
 * @access  Public
 */
exports.getPrices = async (req, res) => {
  try {
    const { cropName, category, state, search } = req.query;
    const query = {};

    if (cropName) query.cropName = new RegExp(cropName, 'i');
    if (category && category !== 'all') query.category = category;
    if (state && state !== 'all') query.state = new RegExp(state, 'i');

    if (search) {
      query.$or = [
        { cropName: new RegExp(search, 'i') },
        { mandiName: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') },
        { state: new RegExp(search, 'i') }
      ];
    }

    let records = [];
    try {
      records = await PriceRecord.find(query).sort('cropName');
    } catch (dbErr) {
      console.warn('MongoDB prices query unavailable, using fallback mandi data:', dbErr.message);
      records = getFallbackPriceRecords({ cropName, category, state, search });
    }

    if (records.length === 0 && (!cropName && !category && !state && !search)) {
      records = getFallbackPriceRecords({});
    }

    // Aggregate summary statistics
    const totalRecords = records.length;
    const avgGain =
      records.length > 0
        ? Math.round(
            records.reduce(
              (sum, r) =>
                sum +
                ((r.fieldrootDirectPrice - r.modalPrice) / (r.modalPrice || 1)) * 100,
              0
            ) / records.length
          )
        : 28;

    res.status(200).json({
      success: true,
      count: totalRecords,
      averageFarmerBonusPercent: avgGain,
      records
    });
  } catch (error) {
    const fallback = getFallbackPriceRecords({});
    res.status(200).json({
      success: true,
      count: fallback.length,
      averageFarmerBonusPercent: 28,
      records: fallback
    });
  }
};

function getFallbackPriceRecords({ cropName, category, state, search }) {
  const data = [
    { _id: 'pr_01', cropName: 'Reetha', category: 'hair care', mandiName: 'APMC Satara', district: 'Satara', state: 'Maharashtra', minPrice: 65, maxPrice: 85, modalPrice: 72, fieldrootDirectPrice: 95, middlemanCutPercent: 32, trend: 'up' },
    { _id: 'pr_02', cropName: 'Shikakai', category: 'hair care', mandiName: 'APMC Pune', district: 'Pune', state: 'Maharashtra', minPrice: 80, maxPrice: 105, modalPrice: 90, fieldrootDirectPrice: 115, middlemanCutPercent: 28, trend: 'up' },
    { _id: 'pr_03', cropName: 'Neem', category: 'hair care', mandiName: 'APMC Junagadh', district: 'Junagadh', state: 'Gujarat', minPrice: 32, maxPrice: 42, modalPrice: 36, fieldrootDirectPrice: 48, middlemanCutPercent: 33, trend: 'stable' },
    { _id: 'pr_04', cropName: 'Fenugreek', category: 'hair care', mandiName: 'APMC Nagaur', district: 'Nagaur', state: 'Rajasthan', minPrice: 44, maxPrice: 56, modalPrice: 48, fieldrootDirectPrice: 62, middlemanCutPercent: 29, trend: 'up' },
    { _id: 'pr_05', cropName: 'Hibiscus', category: 'flowers', mandiName: 'APMC Salem', district: 'Salem', state: 'Tamil Nadu', minPrice: 170, maxPrice: 210, modalPrice: 185, fieldrootDirectPrice: 260, middlemanCutPercent: 29, trend: 'up' },
    { _id: 'pr_06', cropName: 'Turmeric', category: 'skin care', mandiName: 'APMC Sangli', district: 'Sangli', state: 'Maharashtra', minPrice: 95, maxPrice: 125, modalPrice: 110, fieldrootDirectPrice: 145, middlemanCutPercent: 24, trend: 'up' },
    { _id: 'pr_07', cropName: 'Henna', category: 'hair care', mandiName: 'APMC Sojat', district: 'Pali', state: 'Rajasthan', minPrice: 68, maxPrice: 85, modalPrice: 76, fieldrootDirectPrice: 105, middlemanCutPercent: 28, trend: 'stable' },
    { _id: 'pr_08', cropName: 'Amla', category: 'health and wellness', mandiName: 'APMC Pratapgarh', district: 'Pratapgarh', state: 'Uttar Pradesh', minPrice: 55, maxPrice: 75, modalPrice: 64, fieldrootDirectPrice: 85, middlemanCutPercent: 33, trend: 'up' }
  ];

  return data.filter((r) => {
    if (cropName && !r.cropName.toLowerCase().includes(cropName.toLowerCase())) return false;
    if (category && category !== 'all' && r.category.toLowerCase() !== category.toLowerCase()) return false;
    if (state && state !== 'all' && !r.state.toLowerCase().includes(state.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      const match = r.cropName.toLowerCase().includes(q) || r.mandiName.toLowerCase().includes(q) || r.state.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}

/**
 * @desc    Get distinct list of states & crops with price records
 * @route   GET /api/prices/meta
 * @access  Public
 */
exports.getPriceMeta = async (req, res) => {
  try {
    const crops = await PriceRecord.distinct('cropName');
    const states = await PriceRecord.distinct('state');
    const categories = await PriceRecord.distinct('category');

    res.status(200).json({
      success: true,
      crops: crops.sort(),
      states: states.sort(),
      categories: categories.sort()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
