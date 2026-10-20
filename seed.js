/**
 * FieldRoot Connect - Database Seed Script
 * Populates realistic herbal agri-tech data:
 * - Admin, Company Buyer (FieldRoot), and verified Farmers
 * - 30+ Herbal cosmetic ingredients and sample listings
 * - Pre-season farming contracts with 20% advance
 * - Sample orders, tracking statuses & commission breakdown
 * - Mandi benchmark prices vs FieldRoot direct prices
 * - Illustrated organic farming guides & quality grade standards
 * - Farmer community Q&A
 */

require('dotenv').config();
const mongoose = require('mongoose');
const QRCode = require('qrcode');

const User = require('./models/User');
const Product = require('./models/Product');
const Contract = require('./models/Contract');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const Message = require('./models/Message');
const Rating = require('./models/Rating');
const Tip = require('./models/Tip');
const Question = require('./models/Question');
const PriceRecord = require('./models/PriceRecord');
const { HERBAL_INGREDIENTS } = require('./config/constants');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fieldroot_connect';
    await mongoose.connect(mongoUri);
    console.log('🌿 Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Contract.deleteMany({}),
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Message.deleteMany({}),
      Rating.deleteMany({}),
      Tip.deleteMany({}),
      Question.deleteMany({}),
      PriceRecord.deleteMany({})
    ]);
    console.log('🧹 Cleaned existing database collections');

    // 1. Create Users
    console.log('👤 Creating users (Admin, Company Buyer, Farmers)...');

    const admin = await User.create({
      name: 'Dr. Aruna Joshi (Admin)',
      phone: '9876543210',
      email: 'admin@fieldroot.in',
      password: 'password123',
      role: 'admin',
      preferredLanguage: 'en',
      isVerified: true,
      bio: 'Ayurvedic Botanist & FieldRoot Quality Director'
    });

    const companyBuyer = await User.create({
      name: 'FieldRoot Sourcing Team',
      phone: '9822011223',
      email: 'procurement@fieldroot.in',
      password: 'password123',
      role: 'company',
      preferredLanguage: 'en',
      isVerified: true,
      companyDetails: {
        companyName: 'FieldRoot Natural Cosmetics Pvt Ltd',
        gstNumber: '27AABCU9603R1ZM',
        contactPerson: 'Vikramaditya Shinde (Procurement Head)',
        address: 'Plot 14, Ayurvedic Agri Industrial Zone, Hadapsar, Pune, MH 411028',
        subscriptionPlan: 'herbal_brand_pro'
      },
      bio: 'Ethical cosmetic manufacturer sourcing raw natural herbs directly from Indian farmers.'
    });

    const farmer1 = await User.create({
      name: 'Rameshwar Patil',
      phone: '9421055501',
      email: 'ramesh.patil@agrimail.in',
      password: 'password123',
      role: 'farmer',
      village: 'Koregaon',
      district: 'Satara',
      state: 'Maharashtra',
      farmSize: 8.5,
      preferredLanguage: 'mr',
      soilType: 'Black Soil',
      cropsGrown: ['Reetha', 'Shikakai', 'Neem', 'Turmeric'],
      isVerified: true,
      trustScore: 4.9,
      ratingCount: 14,
      bio: 'Practicing Natural Desi Cow-based ZBNF farming for 12 years. Certified organic Reetha & Shikakai grower.'
    });

    const farmer2 = await User.create({
      name: 'Suresh Patel',
      phone: '9825012345',
      email: 'suresh.patel@agrimail.in',
      password: 'password123',
      role: 'farmer',
      village: 'Visnagar',
      district: 'Mehsana',
      state: 'Gujarat',
      farmSize: 12,
      preferredLanguage: 'gu',
      soilType: 'Sandy Loam',
      cropsGrown: ['Aloe Vera', 'Fenugreek', 'Sesame'],
      isVerified: true,
      trustScore: 4.8,
      ratingCount: 19,
      bio: 'Leading Aloe Vera cluster in North Gujarat with shade-drying and fresh leaf supply facility.'
    });

    const farmer3 = await User.create({
      name: 'Murugan Sundaram',
      phone: '9443098765',
      email: 'murugan.s@agrimail.in',
      password: 'password123',
      role: 'farmer',
      village: 'Attur',
      district: 'Salem',
      state: 'Tamil Nadu',
      farmSize: 6,
      preferredLanguage: 'ta',
      soilType: 'Red Soil',
      cropsGrown: ['Hibiscus', 'Moringa', 'Curry Leaves', 'Amla'],
      isVerified: true,
      trustScore: 5.0,
      ratingCount: 11,
      bio: 'Generational herbal cultivator specializing in shade-dried crimson Hibiscus petals and Moringa.'
    });

    const farmer4 = await User.create({
      name: 'Devendra Singh Rathore',
      phone: '9414076543',
      email: 'devendra.singh@agrimail.in',
      password: 'password123',
      role: 'farmer',
      village: 'Sojat Road',
      district: 'Pali',
      state: 'Rajasthan',
      farmSize: 15,
      preferredLanguage: 'hi',
      soilType: 'Arid Soil',
      cropsGrown: ['Henna', 'Ashwagandha', 'Aloe Vera'],
      isVerified: true,
      trustScore: 4.9,
      ratingCount: 22,
      bio: 'Producer of world-renowned Sojat high-Lawsone organic Mehndi and winter-harvested Ashwagandha.'
    });

    const farmer5 = await User.create({
      name: 'Harpreet Singh Sandhu',
      phone: '9815044321',
      email: 'harpreet.sandhu@agrimail.in',
      password: 'password123',
      role: 'farmer',
      village: 'Samrala',
      district: 'Ludhiana',
      state: 'Punjab',
      farmSize: 10,
      preferredLanguage: 'pa',
      soilType: 'Alluvial',
      cropsGrown: ['Fenugreek', 'Chamomile', 'Tulsi'],
      isVerified: true,
      trustScore: 4.7,
      ratingCount: 8,
      bio: 'Transitioned 10 acres to organic chamomile flowers and chemical-free methi seed cultivation.'
    });

    console.log('✅ Created 7 core users (Admin, Buyer, 5 Farmers across MH, GJ, TN, RJ, PB)');

    // 2. Create Products
    console.log('🌿 Creating sample herbal products with QR traceability codes...');

    const sampleProducts = [
      {
        farmer: farmer1._id,
        name: 'Reetha (Soapnut / Aritha)',
        botanicalName: 'Sapindus mukorossi',
        category: 'hair care',
        quantity: 450,
        unit: 'kg',
        pricePerUnit: 95,
        harvestDate: new Date('2026-09-15'),
        availabilityPeriod: 'Immediate Stock (Sun-Dried)',
        isOrganic: true,
        organicDetails: 'Subhash Palekar Natural Farming (SPNF) certified. Desi cow Jeevamrutha treated.',
        description: 'Prime sun-dried golden brown Reetha shells with natural high saponin content. Ideal for FieldRoot Herbal Hair Wash Powder. Destoned and moisture < 9%.',
        images: ['/images/reetha.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 142,
        inquiriesCount: 6
      },
      {
        farmer: farmer1._id,
        name: 'Shikakai Pods (Whole)',
        botanicalName: 'Acacia concinna',
        category: 'hair care',
        quantity: 350,
        unit: 'kg',
        pricePerUnit: 110,
        harvestDate: new Date('2026-08-20'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Wild-crafted organic certified from Western Ghats buffer zone.',
        description: 'Thick, resinous dark-maroon Shikakai pods rich in natural lupeol and spinasterol. Gently shade dried on elevated mesh platforms.',
        images: ['/images/shikakai.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 98,
        inquiriesCount: 4
      },
      {
        farmer: farmer1._id,
        name: 'Neem Leaf Flakes (Shade Dried)',
        botanicalName: 'Azadirachta indica',
        category: 'hair care',
        quantity: 250,
        unit: 'kg',
        pricePerUnit: 68,
        harvestDate: new Date('2026-09-28'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Farm-grown old neem trees, zero chemical sprays.',
        description: 'Vibrant green dried neem foliage. Hand-sorted to remove all thick twigs and dirt. Highly aromatic with intense bitter antimicrobial principles.',
        images: ['/images/neem.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 76,
        inquiriesCount: 3
      },
      {
        farmer: farmer2._id,
        name: 'Aloe Vera Fresh Barbadensis Fillets',
        botanicalName: 'Aloe barbadensis Miller',
        category: 'skin care',
        quantity: 1200,
        unit: 'kg',
        pricePerUnit: 28,
        harvestDate: new Date('2026-10-10'),
        availabilityPeriod: 'Weekly harvest on order',
        isOrganic: true,
        organicDetails: 'Jaivik Bharat certified organic cultivation.',
        description: 'Mature 3-year-old Aloe Vera leaves weighing 700g+ each. High polysaccharide gel matrix, harvested within 12 hours of dispatch for cosmetic processing.',
        images: ['/images/aloe_vera.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 215,
        inquiriesCount: 12
      },
      {
        farmer: farmer2._id,
        name: 'Fenugreek Bold Seeds (Organic Methi)',
        botanicalName: 'Trigonella foenum-graecum',
        category: 'hair care',
        quantity: 600,
        unit: 'kg',
        pricePerUnit: 78,
        harvestDate: new Date('2026-07-15'),
        availabilityPeriod: 'Ready in warehouse',
        isOrganic: true,
        organicDetails: 'PGS-India Green certified organic.',
        description: 'Clean amber-gold fenugreek seeds with 99.8% mechanical purity. Superior mucilage extraction profile for anti-dandruff hair mask formulation.',
        images: ['/images/fenugreek.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 89,
        inquiriesCount: 5
      },
      {
        farmer: farmer3._id,
        name: 'Hibiscus Crimson Petals (Dried)',
        botanicalName: 'Hibiscus rosa-sinensis',
        category: 'flowers',
        quantity: 180,
        unit: 'kg',
        pricePerUnit: 260,
        harvestDate: new Date('2026-10-02'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Natural biodynamic farm, zero pesticides.',
        description: 'Organically grown traditional single red Hibiscus (Sembaruthi). Plucked early morning and shade-dried to retain natural anthocyanins and organic acids.',
        images: ['/images/hibiscus.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 184,
        inquiriesCount: 9
      },
      {
        farmer: farmer3._id,
        name: 'Moringa Leaf Powder (Cold Dehydrated)',
        botanicalName: 'Moringa oleifera',
        category: 'health and wellness',
        quantity: 300,
        unit: 'kg',
        pricePerUnit: 115,
        harvestDate: new Date('2026-09-18'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Solar tunnel dehydrated, certified organic.',
        description: 'Ultra-fine 80 mesh bright green moringa powder. Free from heavy metals, rich in natural zinc and zeatin for scalp cellular repair.',
        images: ['/images/moringa.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 110,
        inquiriesCount: 4
      },
      {
        farmer: farmer4._id,
        name: 'Sojat Organic Henna (Triple Sifted)',
        botanicalName: 'Lawsonia inermis',
        category: 'hair care',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 105,
        harvestDate: new Date('2026-08-30'),
        availabilityPeriod: 'Ready to ship',
        isOrganic: true,
        organicDetails: 'Geographical Indication (GI) tagged Sojat Henna, 100% natural.',
        description: 'High Lawsone content (> 2.8%) pure Mehndi leaves from Pali arid belt. Cloth-sifted, free from synthetic dyes, picramic acid or paraphenylenediamine (PPD).',
        images: ['/images/henna.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 310,
        inquiriesCount: 15
      },
      {
        farmer: farmer4._id,
        name: 'Nagori Ashwagandha Roots',
        botanicalName: 'Withania somnifera',
        category: 'health and wellness',
        quantity: 220,
        unit: 'kg',
        pricePerUnit: 280,
        harvestDate: new Date('2026-07-22'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Cultivated in arid sandy soil with neem cake fertilizer.',
        description: 'Prime Nagori thick roots with white starchy core and brittle snap. Rich in Withanolides for stress-relief cosmetic hair oils and restorative balms.',
        images: ['/images/ashwagandha.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 125,
        inquiriesCount: 7
      },
      {
        farmer: farmer5._id,
        name: 'German Chamomile Dried Flowers',
        botanicalName: 'Matricaria chamomilla',
        category: 'flowers',
        quantity: 90,
        unit: 'kg',
        pricePerUnit: 520,
        harvestDate: new Date('2026-06-25'),
        availabilityPeriod: 'Limited stock',
        isOrganic: true,
        organicDetails: 'Certified natural cultivation along Punjab canals.',
        description: 'Whole yellow chamomile heads with intact petals, high bisabolol and chamazulene aroma. Calms sensitive itchy scalps and clarifies natural hair tones.',
        images: ['/images/chamomile.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 167,
        inquiriesCount: 8
      },
      {
        farmer: farmer1._id,
        name: 'Amla Dried Segments (Black Gutli-mukt)',
        botanicalName: 'Phyllanthus emblica',
        category: 'hair care',
        quantity: 400,
        unit: 'kg',
        pricePerUnit: 105,
        harvestDate: new Date('2026-08-10'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Forest-edge orchard, zero sulfur bleaching.',
        description: 'Traditional seedless black dried amla segments. Sun cured naturally for hair darkening, conditioning, and dandruff suppression.',
        images: ['/images/amla.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 140,
        inquiriesCount: 6
      },
      {
        farmer: farmer3._id,
        name: 'Aromatic Curry Leaves (Dehydrated)',
        botanicalName: 'Murraya koenigii',
        category: 'hair care',
        quantity: 150,
        unit: 'kg',
        pricePerUnit: 80,
        harvestDate: new Date('2026-10-05'),
        availabilityPeriod: 'Immediate',
        isOrganic: true,
        organicDetails: 'Rainfed organic plantation, harvested early morning.',
        description: 'Bright deep green dehydrated curry leaves. Essential beta-carotene and essential oil preserved for anti-greying Ayurvedic hair oils.',
        images: ['/images/curry_leaves.jpg'],
        qualityGrade: 'Grade A (Export / Prime)',
        status: 'available',
        views: 95,
        inquiriesCount: 3
      }
    ];

    const createdProducts = [];
    for (const prodData of sampleProducts) {
      // Generate QR Code data for traceability
      const traceUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/traceability.html?batch=${prodData.batchNumber || 'sample'}`;
      prodData.qrCodeDataUrl = await QRCode.toDataURL(traceUrl);
      const prod = await Product.create(prodData);
      // Update with exact batch number URL
      const finalUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/traceability.html?batch=${prod.batchNumber}`;
      prod.qrCodeDataUrl = await QRCode.toDataURL(finalUrl);
      await prod.save();
      createdProducts.push(prod);
    }
    console.log(`✅ Created ${createdProducts.length} verified herbal product listings with dynamic QR codes`);

    // 3. Create Pre-season Contracts
    console.log('📜 Creating company pre-season contracts with 20% advance terms...');

    const contractsData = [
      {
        company: companyBuyer._id,
        title: 'Kharif 2026 Guaranteed Sourcing: Reetha Shells (1,000 kg)',
        cropName: 'Reetha',
        category: 'hair care',
        requiredQuantity: 1000,
        unit: 'kg',
        pricePerUnit: 98,
        advancePercentage: 20,
        targetDeliveryDate: new Date('2026-12-15'),
        specifications: 'Moisture < 10%. Destoned whole shells. Grown using non-chemical organic methods. FieldRoot guaranteed buy-back rate.',
        status: 'accepted',
        acceptedFarmer: farmer1._id,
        acceptedDate: new Date('2026-08-01'),
        advancePaid: true,
        timeline: [
          { stage: 'Contract Signed', expectedDate: new Date('2026-08-01'), completedDate: new Date('2026-08-01'), completed: true, notes: 'Contract executed digitally' },
          { stage: '20% Advance Disbursed', expectedDate: new Date('2026-08-05'), completedDate: new Date('2026-08-05'), completed: true, notes: 'Rs 19,600 transferred via NEFT' },
          { stage: 'Sowing / Cultivation', expectedDate: new Date('2026-09-15'), completedDate: new Date('2026-09-20'), completed: true, notes: 'Harvest progressing well' },
          { stage: 'Harvest & QC', expectedDate: new Date('2026-11-20'), completed: false, notes: 'Scheduled quality inspection' },
          { stage: 'Final Delivery & Settlement', expectedDate: new Date('2026-12-15'), completed: false, notes: 'Final delivery at Pune warehouse' }
        ]
      },
      {
        company: companyBuyer._id,
        title: 'Aloe Vera Barbadensis - Sourcing 1,500 kg for Herbal Hair Wash Batch',
        cropName: 'Aloe Vera',
        category: 'skin care',
        requiredQuantity: 1500,
        unit: 'kg',
        pricePerUnit: 32,
        advancePercentage: 20,
        targetDeliveryDate: new Date('2026-11-30'),
        specifications: 'Fresh mature leaf fillets, 600g+ each, pesticide-free, delivered within 24 hours of harvest.',
        status: 'open',
        timeline: [
          { stage: 'Contract Signed', expectedDate: new Date('2026-10-25'), completed: false },
          { stage: '20% Advance Disbursed', expectedDate: new Date('2026-10-30'), completed: false },
          { stage: 'Harvest & QC', expectedDate: new Date('2026-11-20'), completed: false },
          { stage: 'Final Delivery & Settlement', expectedDate: new Date('2026-11-30'), completed: false }
        ]
      },
      {
        company: companyBuyer._id,
        title: 'Winter Season Sourcing: 400 kg Organic Fenugreek (Methi)',
        cropName: 'Fenugreek',
        category: 'hair care',
        requiredQuantity: 400,
        unit: 'kg',
        pricePerUnit: 82,
        advancePercentage: 20,
        targetDeliveryDate: new Date('2027-01-20'),
        specifications: 'Bold amber seeds, purity > 99.5%, certified chemical-free.',
        status: 'open',
        timeline: [
          { stage: 'Contract Signed', expectedDate: new Date('2026-11-05'), completed: false },
          { stage: '20% Advance Disbursed', expectedDate: new Date('2026-11-10'), completed: false },
          { stage: 'Harvest & QC', expectedDate: new Date('2027-01-10'), completed: false },
          { stage: 'Final Delivery & Settlement', expectedDate: new Date('2027-01-20'), completed: false }
        ]
      },
      {
        company: companyBuyer._id,
        title: 'Spring Crimson Hibiscus Petals - 250 kg Direct Buy',
        cropName: 'Hibiscus',
        category: 'flowers',
        requiredQuantity: 250,
        unit: 'kg',
        pricePerUnit: 275,
        advancePercentage: 20,
        targetDeliveryDate: new Date('2026-11-10'),
        specifications: 'Shade-dried crimson whole petals, zero green stem sepals, rich aroma.',
        status: 'accepted',
        acceptedFarmer: farmer3._id,
        acceptedDate: new Date('2026-09-01'),
        advancePaid: true,
        timeline: [
          { stage: 'Contract Signed', expectedDate: new Date('2026-09-01'), completedDate: new Date('2026-09-01'), completed: true },
          { stage: '20% Advance Disbursed', expectedDate: new Date('2026-09-04'), completedDate: new Date('2026-09-04'), completed: true },
          { stage: 'Sowing / Cultivation', expectedDate: new Date('2026-10-01'), completedDate: new Date('2026-10-05'), completed: true },
          { stage: 'Harvest & QC', expectedDate: new Date('2026-10-25'), completed: false },
          { stage: 'Final Delivery & Settlement', expectedDate: new Date('2026-11-10'), completed: false }
        ]
      }
    ];

    const createdContracts = await Contract.create(contractsData);
    console.log(`✅ Created ${createdContracts.length} contract farming agreements`);

    // 4. Create Orders & Invoices (Demonstrating the full lifecycle & 2.5% commission breakdown)
    console.log('📦 Creating sample orders with status progression and commission invoices...');

    // Order 1: Completed & Paid (Farmer 1 Reetha)
    const subtotal1 = 200 * 95; // 19,000
    const comm1 = (subtotal1 * 2.5) / 100; // 475
    const order1 = await Order.create({
      buyer: companyBuyer._id,
      farmer: farmer1._id,
      product: createdProducts[0]._id,
      productName: 'Reetha (Soapnut / Aritha)',
      quantity: 200,
      unit: 'kg',
      offeredPricePerUnit: 95,
      finalPricePerUnit: 95,
      subtotal: subtotal1,
      commissionPercent: 2.5,
      commissionAmount: comm1,
      totalBuyerPayable: subtotal1 + comm1,
      farmerReceivable: subtotal1,
      status: 'Paid',
      dispatchDetails: {
        courierName: 'VRL Agri Logistics',
        trackingNumber: 'VRL-PUN-77291',
        dispatchDate: new Date('2026-09-22')
      },
      deliveredAt: new Date('2026-09-25'),
      paidAt: new Date('2026-09-26'),
      notes: 'Delivered to Pune plant. Batch tested with 9.8% moisture and high froth index. Excellent quality.',
      isRated: true
    });

    // Rating for Order 1
    await Rating.create({
      order: order1._id,
      reviewer: companyBuyer._id,
      farmer: farmer1._id,
      rating: 5,
      qualityScore: 5,
      purityScore: 5,
      deliveryScore: 5,
      reviewTitle: 'Exemplary ZBNF Reetha Quality',
      comment: 'Top tier soapnut pericarp. Zero stones or dust. Foam test exceeded lab benchmarks. Immediate payment released.'
    });

    // Payment for Order 1
    await Payment.create({
      order: order1._id,
      payer: companyBuyer._id,
      recipient: farmer1._id,
      paymentType: 'full_settlement',
      amount: subtotal1,
      status: 'completed',
      paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
      transactionRef: 'NEFT-SBI-20260926-88192',
      paidAt: new Date('2026-09-26')
    });

    // Order 2: Dispatched (Farmer 3 Hibiscus)
    const subtotal2 = 100 * 260; // 26,000
    const comm2 = (subtotal2 * 2.5) / 100; // 650
    const order2 = await Order.create({
      buyer: companyBuyer._id,
      farmer: farmer3._id,
      product: createdProducts[5]._id,
      productName: 'Hibiscus Crimson Petals (Dried)',
      quantity: 100,
      unit: 'kg',
      offeredPricePerUnit: 250,
      counterPricePerUnit: 260,
      finalPricePerUnit: 260,
      subtotal: subtotal2,
      commissionPercent: 2.5,
      commissionAmount: comm2,
      totalBuyerPayable: subtotal2 + comm2,
      farmerReceivable: subtotal2,
      status: 'Dispatched',
      dispatchDetails: {
        courierName: 'TCI Freight Express',
        trackingNumber: 'TCI-SLM-44912',
        dispatchDate: new Date('2026-10-18')
      },
      notes: 'Counter offer of Rs 260/kg accepted due to shade drying quality. Dispatched from Salem hub.',
      negotiationHistory: [
        { offeredBy: companyBuyer._id, senderRole: 'company', pricePerUnit: 250, message: 'Can you supply at Rs 250/kg for 100 kg?' },
        { offeredBy: farmer3._id, senderRole: 'farmer', pricePerUnit: 260, message: 'Sir, our petals are shade dried and hand-picked. 260 is fair rate.' },
        { offeredBy: companyBuyer._id, senderRole: 'company', pricePerUnit: 260, message: 'Agreed on 260/kg. Order confirmed.' }
      ]
    });

    // Order 3: Requested with Negotiation in Progress (Farmer 4 Henna)
    const subtotal3 = 300 * 105; // 31,500
    const comm3 = (subtotal3 * 2.5) / 100; // 787.5
    const order3 = await Order.create({
      buyer: companyBuyer._id,
      farmer: farmer4._id,
      product: createdProducts[7]._id,
      productName: 'Sojat Organic Henna (Triple Sifted)',
      quantity: 300,
      unit: 'kg',
      offeredPricePerUnit: 100,
      counterPricePerUnit: 105,
      finalPricePerUnit: 105,
      subtotal: subtotal3,
      commissionPercent: 2.5,
      commissionAmount: comm3,
      totalBuyerPayable: subtotal3 + comm3,
      farmerReceivable: subtotal3,
      status: 'Accepted',
      notes: 'Accepted by farmer. Packing in 25kg moisture-proof drums in progress.',
      negotiationHistory: [
        { offeredBy: companyBuyer._id, senderRole: 'company', pricePerUnit: 100, message: 'Requesting 300 kg at Rs 100/kg.' },
        { offeredBy: farmer4._id, senderRole: 'farmer', pricePerUnit: 105, message: 'This is triple-sifted GI certified stock, Rs 105 is wholesale rate.' }
      ]
    });

    // Order 4: Advance payment on Contract 1 (Farmer 1 Contract)
    const contractVal = 1000 * 98; // 98,000
    const advanceVal = contractVal * 0.20; // 19,600
    await Payment.create({
      order: order1._id,
      payer: companyBuyer._id,
      recipient: farmer1._id,
      paymentType: 'advance_20',
      amount: advanceVal,
      status: 'completed',
      paymentMethod: 'Direct Bank Transfer (NEFT/RTGS)',
      transactionRef: 'NEFT-SBI-ADV-20260805-10291',
      paidAt: new Date('2026-08-05'),
      notes: '20% Pre-season advance payment for 1,000 kg Reetha contract'
    });

    console.log('✅ Created sample orders, negotiations, payments & trust ratings');

    // 5. Create Direct Chat Messages
    console.log('💬 Creating sample chat messages between buyer and farmers...');
    await Message.create([
      {
        sender: companyBuyer._id,
        recipient: farmer1._id,
        product: createdProducts[0]._id,
        text: 'Namaste Rameshwar ji! We received the lab test report for the 200 kg Reetha sample. Saponin index is 12.4%, which is wonderful.',
        read: true,
        createdAt: new Date('2026-09-24T10:30:00Z')
      },
      {
        sender: farmer1._id,
        recipient: companyBuyer._id,
        product: createdProducts[0]._id,
        text: 'Namaste Vikramaditya ji. Thank you! We only use desi cow compost and sun cure the shells on elevated bamboo racks. Moisture is kept below 9%.',
        read: true,
        createdAt: new Date('2026-09-24T11:15:00Z')
      },
      {
        sender: companyBuyer._id,
        recipient: farmer1._id,
        product: createdProducts[0]._id,
        text: 'We are processing the direct NEFT payment of Rs 19,000 right away without any deductions. Looking forward to our pre-season contract fulfillment in December.',
        read: true,
        createdAt: new Date('2026-09-24T14:20:00Z')
      },
      {
        sender: farmer1._id,
        recipient: companyBuyer._id,
        text: 'Payment received in SBI account! Thank you FieldRoot for eliminating the middlemen who took 30% cut in APMC mandi.',
        read: true,
        createdAt: new Date('2026-09-26T17:05:00Z')
      }
    ]);
    console.log('✅ Created chat thread');

    // 6. Create Mandi Benchmark Price Records across 30+ Crops
    console.log('📊 Creating Mandi price records for price comparison tracker...');
    const mandiPriceData = [
      { cropName: 'Reetha', category: 'hair care', mandiName: 'APMC Pune', district: 'Pune', state: 'Maharashtra', minPrice: 62, maxPrice: 75, modalPrice: 68, fieldrootDirectPrice: 95, middlemanCutPercent: 28, trend: 'up' },
      { cropName: 'Shikakai', category: 'hair care', mandiName: 'APMC Satara', district: 'Satara', state: 'Maharashtra', minPrice: 75, maxPrice: 88, modalPrice: 82, fieldrootDirectPrice: 110, middlemanCutPercent: 25, trend: 'stable' },
      { cropName: 'Neem', category: 'hair care', mandiName: 'APMC Neemuch', district: 'Neemuch', state: 'Madhya Pradesh', minPrice: 42, maxPrice: 54, modalPrice: 48, fieldrootDirectPrice: 68, middlemanCutPercent: 29, trend: 'up' },
      { cropName: 'Fenugreek', category: 'hair care', mandiName: 'APMC Unjha', district: 'Mehsana', state: 'Gujarat', minPrice: 52, maxPrice: 64, modalPrice: 58, fieldrootDirectPrice: 78, middlemanCutPercent: 26, trend: 'stable' },
      { cropName: 'Aloe Vera', category: 'skin care', mandiName: 'APMC Visnagar', district: 'Mehsana', state: 'Gujarat', minPrice: 14, maxPrice: 20, modalPrice: 16, fieldrootDirectPrice: 28, middlemanCutPercent: 43, trend: 'up' },
      { cropName: 'Amla', category: 'hair care', mandiName: 'APMC Pratapgarh', district: 'Pratapgarh', state: 'Uttar Pradesh', minPrice: 65, maxPrice: 82, modalPrice: 72, fieldrootDirectPrice: 105, middlemanCutPercent: 31, trend: 'up' },
      { cropName: 'Hibiscus', category: 'flowers', mandiName: 'APMC Salem', district: 'Salem', state: 'Tamil Nadu', minPrice: 170, maxPrice: 210, modalPrice: 185, fieldrootDirectPrice: 260, middlemanCutPercent: 29, trend: 'up' },
      { cropName: 'Turmeric', category: 'skin care', mandiName: 'APMC Sangli', district: 'Sangli', state: 'Maharashtra', minPrice: 95, maxPrice: 125, modalPrice: 110, fieldrootDirectPrice: 145, middlemanCutPercent: 24, trend: 'up' },
      { cropName: 'Henna', category: 'hair care', mandiName: 'APMC Sojat', district: 'Pali', state: 'Rajasthan', minPrice: 68, maxPrice: 85, modalPrice: 76, fieldrootDirectPrice: 105, middlemanCutPercent: 28, trend: 'stable' },
      { cropName: 'Bhringraj', category: 'herbs', mandiName: 'APMC Neemuch', district: 'Neemuch', state: 'Madhya Pradesh', minPrice: 90, maxPrice: 120, modalPrice: 105, fieldrootDirectPrice: 155, middlemanCutPercent: 32, trend: 'up' },
      { cropName: 'Brahmi', category: 'herbs', mandiName: 'APMC Thrissur', district: 'Thrissur', state: 'Kerala', minPrice: 110, maxPrice: 145, modalPrice: 128, fieldrootDirectPrice: 180, middlemanCutPercent: 29, trend: 'up' },
      { cropName: 'Tulsi', category: 'herbs', mandiName: 'APMC Bareilly', district: 'Bareilly', state: 'Uttar Pradesh', minPrice: 70, maxPrice: 95, modalPrice: 82, fieldrootDirectPrice: 120, middlemanCutPercent: 32, trend: 'stable' },
      { cropName: 'Moringa', category: 'health and wellness', mandiName: 'APMC Dindigul', district: 'Dindigul', state: 'Tamil Nadu', minPrice: 70, maxPrice: 90, modalPrice: 78, fieldrootDirectPrice: 115, middlemanCutPercent: 32, trend: 'up' },
      { cropName: 'Rose Petals', category: 'flowers', mandiName: 'APMC Pushkar', district: 'Ajmer', state: 'Rajasthan', minPrice: 210, maxPrice: 280, modalPrice: 240, fieldrootDirectPrice: 340, middlemanCutPercent: 29, trend: 'up' },
      { cropName: 'Coconut', category: 'oils', mandiName: 'APMC Kozhikode', district: 'Kozhikode', state: 'Kerala', minPrice: 105, maxPrice: 130, modalPrice: 118, fieldrootDirectPrice: 155, middlemanCutPercent: 24, trend: 'stable' },
      { cropName: 'Curry Leaves', category: 'hair care', mandiName: 'APMC Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', minPrice: 40, maxPrice: 58, modalPrice: 48, fieldrootDirectPrice: 80, middlemanCutPercent: 40, trend: 'up' },
      { cropName: 'Ashwagandha', category: 'health and wellness', mandiName: 'APMC Mandsaur', district: 'Mandsaur', state: 'Madhya Pradesh', minPrice: 180, maxPrice: 230, modalPrice: 205, fieldrootDirectPrice: 280, middlemanCutPercent: 27, trend: 'up' },
      { cropName: 'Chamomile', category: 'flowers', mandiName: 'APMC Amritsar', district: 'Amritsar', state: 'Punjab', minPrice: 340, maxPrice: 420, modalPrice: 380, fieldrootDirectPrice: 520, middlemanCutPercent: 27, trend: 'stable' },
      { cropName: 'Shatavari', category: 'herbs', mandiName: 'APMC Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh', minPrice: 190, maxPrice: 250, modalPrice: 220, fieldrootDirectPrice: 310, middlemanCutPercent: 29, trend: 'up' },
      { cropName: 'Vetiver (Khus)', category: 'oils', mandiName: 'APMC Kannauj', district: 'Kannauj', state: 'Uttar Pradesh', minPrice: 220, maxPrice: 290, modalPrice: 255, fieldrootDirectPrice: 360, middlemanCutPercent: 29, trend: 'up' },
      { cropName: 'Manjistha', category: 'skin care', mandiName: 'APMC Almora', district: 'Almora', state: 'Uttarakhand', minPrice: 130, maxPrice: 175, modalPrice: 150, fieldrootDirectPrice: 210, middlemanCutPercent: 28, trend: 'stable' },
      { cropName: 'Mulethi (Licorice)', category: 'skin care', mandiName: 'APMC Bikaner', district: 'Bikaner', state: 'Rajasthan', minPrice: 150, maxPrice: 200, modalPrice: 175, fieldrootDirectPrice: 245, middlemanCutPercent: 28, trend: 'up' },
      { cropName: 'Nagarmotha', category: 'herbs', mandiName: 'APMC Gwalior', district: 'Gwalior', state: 'Madhya Pradesh', minPrice: 75, maxPrice: 105, modalPrice: 88, fieldrootDirectPrice: 130, middlemanCutPercent: 32, trend: 'stable' },
      { cropName: 'Multani Mitti', category: 'skin care', mandiName: 'APMC Barmer', district: 'Barmer', state: 'Rajasthan', minPrice: 12, maxPrice: 22, modalPrice: 16, fieldrootDirectPrice: 32, middlemanCutPercent: 50, trend: 'stable' },
      { cropName: 'Gotu Kola (Mandukaparni)', category: 'skin care', mandiName: 'APMC Wayanad', district: 'Wayanad', state: 'Kerala', minPrice: 115, maxPrice: 160, modalPrice: 135, fieldrootDirectPrice: 195, middlemanCutPercent: 31, trend: 'up' }
    ];

    await PriceRecord.create(mandiPriceData);
    console.log(`✅ Seeded ${mandiPriceData.length} Mandi vs FieldRoot price comparison records`);

    // 7. Create Illustrated Organic Farming Tips & Quality Guides
    console.log('📖 Seeding organic farming and cosmetic quality guides...');
    const tipsData = [
      {
        title: 'Making Potent Jeevamrutha for High-Saponin Reetha & Shikakai',
        category: 'composting',
        summary: 'Enrich soil microbiome naturally with indigenous cow dung, urine, jaggery, and pulse flour.',
        imageUrl: '/images/tip_jeevamrutha.jpg',
        author: 'FieldRoot Organic Advisory Board',
        tags: ['ZBNF', 'Soil Health', 'Reetha', 'Shikakai'],
        content: `Jeevamrutha is an astonishing natural bio-enhancer proven to increase fruit size and natural saponin concentration in soapnut trees. It contains millions of beneficial aerobic and anaerobic microbes that mobilize fixed soil phosphorus and micro-nutrients without artificial fertilizers.`,
        steps: [
          {
            stepNumber: 1,
            title: 'Prepare the 200L Drum Mixture',
            description: 'Fill a plastic barrel with 200 liters of water. Add 10 kg of fresh desi cow dung and 5-10 liters of desi cow urine.',
            proTip: 'Always use fresh desi (indigenous breed) cow dung within 48 hours for maximum microbial diversity.'
          },
          {
            stepNumber: 2,
            title: 'Add Microbial Food (Jaggery & Pulse Flour)',
            description: 'Dissolve 2 kg organic chemical-free black jaggery and 2 kg besan (gram/pulse flour) in a bucket of water and add into the drum.',
            proTip: 'Black unrefined jaggery contains rich minerals that feed beneficial bacteria much faster than white refined sugar.'
          },
          {
            stepNumber: 3,
            title: 'Inoculate with Virgin Forest / Tree Base Soil',
            description: 'Add a handful (approx 100g) of soil collected from the root zone of old Banyan or Neem trees where no chemicals were ever sprayed.',
            proTip: 'This acts as the mother culture of mycorrhiza and natural actinomycetes.'
          },
          {
            stepNumber: 4,
            title: 'Fermentation & Stirring Clockwise',
            description: 'Keep the drum in shade covered with a gunny sack. Stir clockwise with a wooden stick for 10 minutes morning and evening for 4 to 6 days.',
            proTip: 'Apply 200 liters per acre through drip irrigation or direct ring watering around tree basins.'
          }
        ]
      },
      {
        title: 'FieldRoot Botanical Quality Guide: Understanding Grades A, B & C',
        category: 'quality_grades',
        summary: 'Learn what cosmetic cosmetic chemists test in your harvest to qualify for premium Grade A pricing.',
        imageUrl: '/images/tip_quality.jpg',
        author: 'Dr. Aruna Joshi (FieldRoot Quality Director)',
        tags: ['Quality Grades', 'Ayurvedic Testing', 'Pricing', 'Moisture Standards'],
        content: `When your herbs arrive at our Pune sourcing hub, our quality control lab performs four key checks: moisture percentage, foreign botanical matter, active phytoconstituents (saponins, lawsone, curcumin, or mucilage), and microbial safety. Meeting Grade A earns you our highest guaranteed price.`,
        steps: [
          {
            stepNumber: 1,
            title: 'Grade A (Export & Premium Cosmetics) - Highest Payout',
            description: 'Moisture < 10%, zero synthetic chemical residues, whole unbroken pods or leaves, vibrant natural aroma, purity > 99%.',
            proTip: 'FieldRoot pays a 20-35% cash bonus over standard market rates for certified Grade A batches.'
          },
          {
            stepNumber: 2,
            title: 'Grade B (Standard Commercial Formulation)',
            description: 'Moisture 10-12%, slight fragmentation (broken shells or small pods), purity 96-98%, acceptable active markers.',
            proTip: 'Grade B is accepted for standard extract manufacturing and bulk herbal decoctions.'
          },
          {
            stepNumber: 3,
            title: 'Grade C (Industrial / Below Standard)',
            description: 'Moisture > 12% (risk of mold), discoloration from direct excessive sun baking, high stem/twigs ratio.',
            proTip: 'We never discard Grade C outright—we provide drying feedback and suggest blending options for non-sensitive applications.'
          }
        ]
      },
      {
        title: 'Natural Pest Spray: Making 5-Leaf Extract (Panchaparni Kashayam)',
        category: 'pest_control',
        summary: 'Protect leaves from aphids, mites, and leaf miners without synthetic chemicals using locally available bitter herbs.',
        imageUrl: '/images/tip_pest.jpg',
        author: 'Rameshwar Patil (Master Organic Farmer)',
        tags: ['Pest Control', 'Neem Spray', 'Chemical Free', 'Leaves Protection'],
        content: `Herbivorous pests and insects dislike plants that secrete bitter milky sap or pungent volatile oils. Panchaparni Kashayam combines five such plants to create a potent bio-repellent that safeguards henna, neem, moringa, and hibiscus flushes.`,
        steps: [
          {
            stepNumber: 1,
            title: 'Select 5 Bitter Leaves',
            description: 'Gather 2 kg Neem leaves, 2 kg Calotropis (Arka), 2 kg Custard Apple (Sitaphal) leaves, 2 kg Papaya leaves, and 2 kg Karanj leaves.',
            proTip: 'Cattle do not eat any of these five plants, making them nature’s strongest repellent defense.'
          },
          {
            stepNumber: 2,
            title: 'Crush and Boil into Decoction',
            description: 'Pound leaves into coarse paste. Boil with 10 liters of water until reduced to half (5 liters). Let cool and filter through muslin cloth.',
            proTip: 'Add 200g crushed garlic and 200g green chili paste for enhanced punch against sucking pests.'
          },
          {
            stepNumber: 3,
            title: 'Dilution and Spraying',
            description: 'Dilute 500ml of filtered concentrate in 15 liters of water in a knapsack sprayer. Add 50ml cow urine as sticking agent.',
            proTip: 'Spray during early morning or evening hours every 15 days as preventive shield.'
          }
        ]
      },
      {
        title: 'Solar Dehydration & Herbal Storage to Prevent Aflatoxins',
        category: 'drying_and_storage',
        summary: 'How to shade-dry flowers and roots to retain rich color and avoid mold during monsoons.',
        imageUrl: '/images/tip_drying.jpg',
        author: 'Vikramaditya Shinde (Procurement Head)',
        tags: ['Post-Harvest', 'Shade Drying', 'Storage', 'No Mold'],
        content: `Direct harsh noon sunlight burns away heat-sensitive cosmetic compounds like anthocyanins in Hibiscus, lawsone in Henna, and volatile oils in Chamomile and Lavender. Elevated shade drying under UV-stabilized agro-nets is the secret to getting Grade A classification.`,
        steps: [
          {
            stepNumber: 1,
            title: 'Elevate on Mesh Racks',
            description: 'Never dry valuable herbs directly on soil, tarpaulins or cemented floors where damp condensation collects.',
            proTip: 'Keep racks 2 feet above the ground to ensure 360-degree cross-ventilation.'
          },
          {
            stepNumber: 2,
            title: 'Monitor Moisture Before Bagging',
            description: 'Leaves should crumble between your fingers with a crisp rustle, not bend like leather.',
            proTip: 'Pack strictly in HDPE multi-layer food-grade bags with food-grade silica pouches during humid seasons.'
          }
        ]
      }
    ];

    await Tip.create(tipsData);
    console.log(`✅ Seeded ${tipsData.length} illustrated organic farming and quality guides`);

    // 8. Create Community Q&A Questions
    console.log('💬 Seeding farmer community forum questions & answers...');
    const questionsData = [
      {
        author: farmer1._id,
        title: 'How to preserve the deep crimson red color of Hibiscus petals after harvest?',
        category: 'Harvesting & Drying',
        cropName: 'Hibiscus',
        content: 'Whenever we harvest Hibiscus petals in Satara, they turn dark purplish or blackish within 2 days of drying. What drying technique preserves the bright cosmetic crimson shade FieldRoot requires for hair shampoos?',
        answers: [
          {
            author: farmer3._id,
            authorName: 'Murugan Sundaram (Salem)',
            authorRole: 'farmer',
            content: 'Brother Rameshwar, plucking time is key! Pluck flowers before 8:30 AM when dew has dried but sun is not hot. Remove the green sepals immediately. Dry under 50% green agro-shade net on nylon wire mesh. Never expose to open noon sun, and store in airtight black polythene lined bags.',
            isExpertAnswer: true,
            createdAt: new Date('2026-10-12')
          },
          {
            author: admin._id,
            authorName: 'Dr. Aruna Joshi (Admin)',
            authorRole: 'admin',
            content: 'Murugan ji is spot on. Anthocyanins break down rapidly when exposed to direct UV rays and temperatures above 42°C. Shade-drying at 35-38°C preserves > 92% of the anthocyanin content, guaranteeing you Grade A status at our inspection center.',
            isExpertAnswer: true,
            createdAt: new Date('2026-10-13')
          }
        ]
      },
      {
        author: farmer2._id,
        title: 'Is drip irrigation suitable for Aloe Vera in sandy loam soil?',
        category: 'Crops & Sowing',
        cropName: 'Aloe Vera',
        content: 'We are expanding Aloe Vera plantation by 4 acres in Mehsana. Earlier we did flood irrigation every 15 days, but water table is dropping. Can inline drip work well without causing leaf root rot?',
        answers: [
          {
            author: admin._id,
            authorName: 'Dr. Aruna Joshi (Admin)',
            authorRole: 'admin',
            content: 'Yes! Drip irrigation is actually superior for Aloe Vera. Maintain lateral spacing of 1.2 meters with 4 LPH drippers spaced 60cm apart. Irrigate for 45 minutes twice a week. This prevents basal rot that occurs with standing water and increases polysaccharide gel density by 18%.',
            isExpertAnswer: true,
            createdAt: new Date('2026-09-19')
          }
        ]
      },
      {
        author: farmer5._id,
        title: 'What is the best sowing time for Chamomile in North India?',
        category: 'Crops & Sowing',
        cropName: 'Chamomile',
        content: 'We want to rotate our paddy fields with Chamomile in Ludhiana. Should we nursery sow in October or direct broadcast?',
        answers: [
          {
            author: companyBuyer._id,
            authorName: 'Vikramaditya Shinde (FieldRoot)',
            authorRole: 'company',
            content: 'Nursery sowing is strongly recommended around mid-October. Chamomile seeds are tiny like dust, so direct broadcasting leads to patchy germination. Transplant 30-day seedlings in November. FieldRoot offers pre-sowing buyback contracts for Ludhiana chamomile growers at Rs 520/kg.',
            isExpertAnswer: true,
            createdAt: new Date('2026-10-02')
          }
        ]
      }
    ];

    await Question.create(questionsData);
    console.log(`✅ Seeded ${questionsData.length} community discussions`);

    console.log('\n========================================');
    console.log('🎉 FIELDROOT CONNECT SEEDING COMPLETED!');
    console.log('========================================');
    console.log('Sample Logins:');
    console.log('1. Admin:    Phone: 9876543210 | Password: password123');
    console.log('2. Company:  Phone: 9822011223 | Password: password123');
    console.log('3. Farmer:   Phone: 9421055501 | Password: password123 (Rameshwar, MH)');
    console.log('4. Farmer:   Phone: 9825012345 | Password: password123 (Suresh, GJ)');
    console.log('5. Farmer:   Phone: 9443098765 | Password: password123 (Murugan, TN)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
