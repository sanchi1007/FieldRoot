const Contract = require('../models/Contract');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

/**
 * @desc    Get all contracts (public & company)
 * @route   GET /api/contracts
 * @access  Public
 */
exports.getContracts = async (req, res) => {
  try {
    const { status, cropName, category } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (cropName) query.cropName = new RegExp(cropName, 'i');
    if (category && category !== 'all') query.category = category;

    const contracts = await Contract.find(query)
      .populate('company', 'name companyDetails phone email')
      .populate('acceptedFarmer', 'name phone village district state')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contracts.length,
      contracts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logged in user's contracts (Farmer's accepted or Company's posted)
 * @route   GET /api/contracts/my
 * @access  Private
 */
exports.getMyContracts = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'farmer') {
      query.acceptedFarmer = req.user.id;
    } else if (req.user.role === 'company') {
      query.company = req.user.id;
    }

    const contracts = await Contract.find(query)
      .populate('company', 'name companyDetails phone email')
      .populate('acceptedFarmer', 'name phone village district state trustScore')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contracts.length,
      contracts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single contract by ID
 * @route   GET /api/contracts/:id
 * @access  Public
 */
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('company', 'name companyDetails phone email')
      .populate('acceptedFarmer', 'name phone village district state trustScore');

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    res.status(200).json({
      success: true,
      contract
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Post a new pre-season farming contract
 * @route   POST /api/contracts
 * @access  Private (Company / Admin)
 */
exports.createContract = async (req, res) => {
  try {
    const {
      title,
      cropName,
      category,
      requiredQuantity,
      unit,
      pricePerUnit,
      targetDeliveryDate,
      advancePercentage = 20,
      specifications
    } = req.body;

    if (!title || !cropName || !requiredQuantity || !pricePerUnit || !targetDeliveryDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, crop name, quantity, price, and target delivery date'
      });
    }

    const targetDate = new Date(targetDeliveryDate);
    const now = new Date();
    const midPoint = new Date(now.getTime() + (targetDate.getTime() - now.getTime()) / 2);

    const defaultTimeline = [
      {
        stage: 'Contract Signed',
        expectedDate: now,
        completed: false,
        notes: 'Awaiting farmer acceptance'
      },
      {
        stage: '20% Advance Disbursed',
        expectedDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        completed: false,
        notes: '20% pre-season mobilization payment'
      },
      {
        stage: 'Sowing / Cultivation',
        expectedDate: midPoint,
        completed: false,
        notes: 'Organic field inspection by agronomist'
      },
      {
        stage: 'Harvest & QC',
        expectedDate: new Date(targetDate.getTime() - 10 * 24 * 60 * 60 * 1000),
        completed: false,
        notes: 'Shade-drying and laboratory moisture testing'
      },
      {
        stage: 'Final Delivery & Settlement',
        expectedDate: targetDate,
        completed: false,
        notes: 'Remaining 80% settlement upon receipt at warehouse'
      }
    ];

    const contract = await Contract.create({
      company: req.user.id,
      title: title.trim(),
      cropName: cropName.trim(),
      category: category || 'hair care',
      requiredQuantity: Number(requiredQuantity),
      unit: unit || 'kg',
      pricePerUnit: Number(pricePerUnit),
      advancePercentage: Number(advancePercentage),
      targetDeliveryDate: targetDate,
      specifications: specifications || 'Grade A standard, certified natural / organic cultivation.',
      status: 'open',
      timeline: defaultTimeline
    });

    res.status(201).json({
      success: true,
      message: 'Pre-season contract posted successfully!',
      contract
    });
  } catch (error) {
    console.error('Create Contract Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Farmer accepts an open contract
 * @route   POST /api/contracts/:id/accept
 * @access  Private (Farmer)
 */
exports.acceptContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contract.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This contract has already been accepted or closed'
      });
    }

    contract.status = 'accepted';
    contract.acceptedFarmer = req.user.id;
    contract.acceptedDate = new Date();

    // Mark 'Contract Signed' as completed in timeline
    if (contract.timeline && contract.timeline.length > 0) {
      contract.timeline[0].completed = true;
      contract.timeline[0].completedDate = new Date();
      contract.timeline[0].notes = `Accepted digitally by farmer ${req.user.name}`;
    }

    await contract.save();

    // Create an associated Contract Order
    const subtotal = contract.totalContractValue;
    const comm = (subtotal * 2.5) / 100;
    const advanceAmount = contract.advanceAmount;

    const order = await Order.create({
      buyer: contract.company,
      farmer: req.user.id,
      contract: contract._id,
      orderType: 'contract',
      productName: `${contract.cropName} (Pre-Season Contract)`,
      quantity: contract.requiredQuantity,
      unit: contract.unit,
      offeredPricePerUnit: contract.pricePerUnit,
      finalPricePerUnit: contract.pricePerUnit,
      subtotal: subtotal,
      commissionPercent: 2.5,
      commissionAmount: comm,
      totalBuyerPayable: subtotal + comm,
      farmerReceivable: subtotal,
      advanceAmount: advanceAmount,
      advancePaid: false,
      status: 'Accepted',
      notes: `Generated from pre-season contract: ${contract.title}`
    });

    res.status(200).json({
      success: true,
      message: 'Congratulations! You have accepted this farming contract.',
      contract,
      order
    });
  } catch (error) {
    console.error('Accept Contract Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update contract milestone timeline or release advance
 * @route   PATCH /api/contracts/:id/timeline
 * @access  Private (Company or Admin)
 */
exports.updateTimeline = async (req, res) => {
  try {
    const { stageIndex, completed, notes, isAdvanceDisbursed } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (stageIndex !== undefined && contract.timeline[stageIndex]) {
      contract.timeline[stageIndex].completed = completed !== undefined ? completed : true;
      contract.timeline[stageIndex].completedDate = new Date();
      if (notes) contract.timeline[stageIndex].notes = notes;
    }

    if (isAdvanceDisbursed) {
      contract.advancePaid = true;

      // Also record advance payment
      await Payment.create({
        order: null,
        payer: contract.company,
        recipient: contract.acceptedFarmer,
        paymentType: 'advance_20',
        amount: contract.advanceAmount,
        status: 'completed',
        paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
        notes: `20% advance disbursed for contract ${contract.title}`
      });

      // Update Order advancePaid status if exists
      await Order.findOneAndUpdate(
        { contract: contract._id },
        { advancePaid: true }
      );
    }

    await contract.save();

    res.status(200).json({
      success: true,
      message: 'Timeline updated successfully',
      contract
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
