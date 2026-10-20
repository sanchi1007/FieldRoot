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

    const records = await PriceRecord.find(query).sort('cropName');

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
    res.status(500).json({ success: false, message: error.message });
  }
};

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
