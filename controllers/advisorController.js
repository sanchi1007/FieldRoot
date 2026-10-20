const { HERBAL_INGREDIENTS, SOIL_TYPES } = require('../config/constants');
const Contract = require('../models/Contract');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @desc    Crop Advisor Recommendation Engine
 * @route   POST /api/advisor/recommend
 * @access  Public
 */
exports.recommendCrops = async (req, res) => {
  try {
    const { district, state, soilType, waterSource, farmSize = 1 } = req.body;

    if (!soilType) {
      return res.status(400).json({
        success: false,
        message: 'Please select a soil type'
      });
    }

    const acres = Number(farmSize) || 1;

    // Filter ingredients that match soil type
    let suitableCrops = HERBAL_INGREDIENTS.filter((crop) => {
      return crop.soilTypes.some(
        (st) =>
          st.toLowerCase().includes(soilType.toLowerCase()) ||
          soilType.toLowerCase().includes(st.toLowerCase())
      );
    });

    // If too few, fall back to general high-yield hardy Ayurvedic crops
    if (suitableCrops.length === 0) {
      suitableCrops = HERBAL_INGREDIENTS.slice(0, 6);
    }

    // Check open contracts to flag active company demand
    const openContracts = await Contract.find({ status: 'open' });
    const highDemandNames = openContracts.map((c) => c.cropName.toLowerCase());

    const recommendations = suitableCrops.map((crop) => {
      const isHighDemand = highDemandNames.includes(crop.name.toLowerCase());
      const profitPerAcre = crop.expectedProfitPerAcre;
      const totalEstimatedProfit = profitPerAcre * acres;

      let waterNeed = 'Moderate';
      if (['Aloe Vera', 'Henna', 'Ashwagandha', 'Moringa'].includes(crop.name)) {
        waterNeed = 'Low (Drought Hardy)';
      } else if (['Brahmi', 'Bhringraj', 'Calamus'].includes(crop.name)) {
        waterNeed = 'High (Moist / Marshy)';
      }

      return {
        name: crop.name,
        hindiName: crop.hindiName,
        botanicalName: crop.botanicalName,
        category: crop.category,
        partUsed: crop.partUsed,
        description: crop.description,
        expectedProfitPerAcre: profitPerAcre,
        totalEstimatedProfit,
        typicalPricePerUnit: `₹${crop.typicalPriceRange.min} - ₹${crop.typicalPriceRange.max} / ${crop.typicalPriceRange.unit}`,
        sowingSeason: crop.sowingSeason,
        harvestSeason: crop.harvestSeason,
        waterNeed,
        isFieldRootContractAvailable: isHighDemand,
        matchReason: `Thrives in ${soilType} soil. High active phytoconstituents for FieldRoot herbal cosmetic formulations.`,
        image: crop.defaultImage
      };
    });

    // Sort by profit per acre descending
    recommendations.sort((a, b) => b.expectedProfitPerAcre - a.expectedProfitPerAcre);

    res.status(200).json({
      success: true,
      query: { district, state, soilType, waterSource, farmSize: acres },
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Advisor Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get real-time demand alerts from FieldRoot company needs
 * @route   GET /api/advisor/demand-alerts
 * @access  Public / Private
 */
exports.getDemandAlerts = async (req, res) => {
  try {
    const openContracts = await Contract.find({ status: 'open' })
      .populate('company', 'name companyDetails')
      .sort('-createdAt')
      .limit(6);

    const alerts = openContracts.map((contract) => ({
      id: contract._id,
      title: `URGENT SOURCING: ${contract.cropName} (${contract.requiredQuantity} ${contract.unit})`,
      cropName: contract.cropName,
      quantity: contract.requiredQuantity,
      unit: contract.unit,
      offeredPrice: `₹${contract.pricePerUnit}/${contract.unit}`,
      advanceOffer: `${contract.advancePercentage}% pre-season advance guaranteed`,
      targetDate: contract.targetDeliveryDate,
      postedBy: contract.company?.name || 'FieldRoot Sourcing Team',
      urgency: 'High',
      specs: contract.specifications
    }));

    // If open contracts are few, add baseline demand notices for FieldRoot core herbs
    if (alerts.length < 3) {
      alerts.push({
        id: 'demand-core-1',
        title: 'CONTINUOUS DEMAND: Reetha (Soapnut) Shells for Hair Wash Powder',
        cropName: 'Reetha',
        quantity: 2000,
        unit: 'kg',
        offeredPrice: '₹95/kg',
        advanceOffer: '20% advance upon contract signing',
        targetDate: new Date('2026-12-30'),
        postedBy: 'FieldRoot Sourcing Team',
        urgency: 'Ongoing Sourcing',
        specs: 'Grade A destoned whole shells, moisture < 10%.'
      });
      alerts.push({
        id: 'demand-core-2',
        title: 'CONTINUOUS DEMAND: Organic Shikakai Pods (Western Ghats standard)',
        cropName: 'Shikakai',
        quantity: 1500,
        unit: 'kg',
        offeredPrice: '₹110/kg',
        advanceOffer: '20% advance upon contract signing',
        targetDate: new Date('2027-01-15'),
        postedBy: 'FieldRoot Sourcing Team',
        urgency: 'Ongoing Sourcing',
        specs: 'Whole thick pods, shade-dried, zero synthetic mold retardants.'
      });
    }

    res.status(200).json({
      success: true,
      alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
