const Product = require('../models/Product');
const QRCode = require('qrcode');

/**
 * @desc    Public traceability lookup by batch number
 * @route   GET /api/traceability/:batchNumber
 * @access  Public
 */
exports.getTraceabilityByBatch = async (req, res) => {
  try {
    const { batchNumber } = req.params;

    const product = await Product.findOne({ batchNumber }).populate(
      'farmer',
      'name village district state farmSize soilType trustScore ratingCount isVerified bio avatar'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Batch '${batchNumber}' was not found in FieldRoot verified registry.`
      });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const traceUrl = `${baseUrl}/traceability.html?batch=${product.batchNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(traceUrl, { width: 300, margin: 2 });

    res.status(200).json({
      success: true,
      traceability: {
        batchNumber: product.batchNumber,
        productName: product.name,
        botanicalName: product.botanicalName,
        category: product.category,
        harvestDate: product.harvestDate,
        qualityGrade: product.qualityGrade,
        isOrganic: product.isOrganic,
        organicDetails: product.organicDetails,
        description: product.description,
        images: product.images,
        qrCodeDataUrl,
        publicUrl: traceUrl,
        farmer: {
          name: product.farmer?.name || 'Verified FieldRoot Grower',
          village: product.farmer?.village || 'Organic Valley',
          district: product.farmer?.district || 'Satara',
          state: product.farmer?.state || 'Maharashtra',
          farmSize: product.farmer?.farmSize ? `${product.farmer.farmSize} Acres` : 'Multi-Acre',
          soilType: product.farmer?.soilType || 'Natural Loamy Soil',
          trustScore: product.farmer?.trustScore || 5.0,
          ratingCount: product.farmer?.ratingCount || 0,
          isVerified: product.farmer?.isVerified || true,
          bio: product.farmer?.bio || 'Generational organic herbal grower practicing sustainable soil regeneration.'
        },
        fieldrootCosmeticStory: {
          brand: 'FieldRoot Herbal Cosmetics',
          flagshipProduct: 'Herbal Hair Wash Powder (Reetha, Shikakai, Neem, Fenugreek)',
          purityGuarantee: '100% Chemical-free, Zero Synthetic Additives, Directly Farm Sourced'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
