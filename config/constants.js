/**
 * FieldRoot Connect Constants
 * Includes 30+ Ayurvedic & herbal cosmetic ingredients, categories, soil mapping, and platform configs
 */

const HERBAL_INGREDIENTS = [
  {
    name: "Reetha",
    hindiName: "रीठा (Aritha)",
    botanicalName: "Sapindus mukorossi",
    category: "hair care",
    partUsed: "Dried Fruit / Pericarp",
    description: "Natural saponin-rich cleanser, cornerstone of FieldRoot Herbal Hair Wash Powder.",
    gradeStandards: {
      A: "Round whole shells, deep brown color, moisture < 10%, high saponin lather",
      B: "Slightly broken shells, moderate color uniformity, moisture < 12%",
      C: "Crushed shells, darker color, moisture > 12%"
    },
    soilTypes: ["Loamy", "Sandy Loam", "Laterite"],
    expectedProfitPerAcre: 85000,
    typicalPriceRange: { min: 65, max: 120, unit: "kg" },
    sowingSeason: "Monsoon (July - August)",
    harvestSeason: "Winter (December - February)",
    defaultImage: "/images/reetha.jpg"
  },
  {
    name: "Shikakai",
    hindiName: "शिकाकाई",
    botanicalName: "Acacia concinna",
    category: "hair care",
    partUsed: "Dried Pods",
    description: "Natural mild surfactant and scalp conditioner, rich in vitamins A, C, D, and K.",
    gradeStandards: {
      A: "Long thick whole pods, dark reddish-brown, free from mold, moisture < 11%",
      B: "Medium pods, minor breakage, acceptable lather, moisture < 13%",
      C: "Immature or heavily fragmented pods, moisture > 13%"
    },
    soilTypes: ["Sandy Loam", "Red Soil", "Black Soil"],
    expectedProfitPerAcre: 78000,
    typicalPriceRange: { min: 80, max: 140, unit: "kg" },
    sowingSeason: "June - July",
    harvestSeason: "January - March",
    defaultImage: "/images/shikakai.jpg"
  },
  {
    name: "Neem",
    hindiName: "नीम",
    botanicalName: "Azadirachta indica",
    category: "hair care",
    partUsed: "Shade-Dried Leaves & Seed Kernels",
    description: "Antifungal, antibacterial powerherb that purifies scalp and heals skin ailments.",
    gradeStandards: {
      A: "Intense green dried whole leaves, shade-dried, zero dust/stem debris, aroma intact",
      B: "Slight yellowing or minor stem fragments, moisture < 10%",
      C: "Sun-bleached pale leaves with twig content"
    },
    soilTypes: ["Sandy", "Clay Loam", "Red Soil", "Black Soil", "Alluvial"],
    expectedProfitPerAcre: 60000,
    typicalPriceRange: { min: 45, max: 90, unit: "kg" },
    sowingSeason: "July - August",
    harvestSeason: "Year-round (Best: March - May)",
    defaultImage: "/images/neem.jpg"
  },
  {
    name: "Fenugreek",
    hindiName: "मेथी (Methi)",
    botanicalName: "Trigonella foenum-graecum",
    category: "hair care",
    partUsed: "Dry Seeds",
    description: "High in nicotinic acid and proteins that prevent thinning, restore hair sheen and fight dandruff.",
    gradeStandards: {
      A: "Golden amber uniform bold seeds, free of stones/chaff, germination rate > 90%",
      B: "Small to medium seeds, slight color variation, purity > 98%",
      C: "Mixed grain size, foreign matter > 2%"
    },
    soilTypes: ["Loamy", "Clay Loam", "Alluvial", "Black Soil"],
    expectedProfitPerAcre: 52000,
    typicalPriceRange: { min: 55, max: 105, unit: "kg" },
    sowingSeason: "October - November (Rabi)",
    harvestSeason: "February - March",
    defaultImage: "/images/fenugreek.jpg"
  },
  {
    name: "Aloe Vera",
    hindiName: "घृतकुमारी (Aloe Vera)",
    botanicalName: "Aloe barbadensis Miller",
    category: "skin care",
    partUsed: "Fresh Gel-rich Leaves",
    description: "Hydrating mucilage powerhouse for cooling cosmetic formulations and scalp soothing.",
    gradeStandards: {
      A: "Mature leaves > 600g each, thick gel fillet, no spots, cut within 24h of dispatch",
      B: "Medium leaves (350g-600g), firm gel, minimal spotting",
      C: "Thin leaves < 300g or bruised tips"
    },
    soilTypes: ["Sandy Loam", "Arid Soil", "Laterite", "Red Soil"],
    expectedProfitPerAcre: 110000,
    typicalPriceRange: { min: 18, max: 40, unit: "kg" },
    sowingSeason: "July - August / February - March",
    harvestSeason: "Year-round after 8 months",
    defaultImage: "/images/aloe_vera.jpg"
  },
  {
    name: "Amla",
    hindiName: "आंवला (Indian Gooseberry)",
    botanicalName: "Phyllanthus emblica",
    category: "hair care",
    partUsed: "Dried Segments (Gutli-mukt) / Fresh",
    description: "World's richest natural source of stable vitamin C, boosts melanin and strengthens hair roots.",
    gradeStandards: {
      A: "Seedless sun/solar-dried thick black segments, intense sourness, no mold",
      B: "Minor seeds included, brown-black coloration, moisture < 12%",
      C: "High seed ratio, dusty or over-roasted appearance"
    },
    soilTypes: ["Sandy Loam", "Clay Loam", "Alluvial", "Alkaline Tolerant"],
    expectedProfitPerAcre: 95000,
    typicalPriceRange: { min: 65, max: 130, unit: "kg" },
    sowingSeason: "July - September",
    harvestSeason: "November - February",
    defaultImage: "/images/amla.jpg"
  },
  {
    name: "Hibiscus",
    hindiName: "गुड़हल (Jaswand)",
    botanicalName: "Hibiscus rosa-sinensis",
    category: "flowers",
    partUsed: "Dried Red Petals & Whole Calyx",
    description: "Rich in amino acids and alpha hydroxy acids, stimulates dormant follicles and adds gloss.",
    gradeStandards: {
      A: "Vibrant deep crimson whole dried petals, shade-dried, fragrant, zero moisture",
      B: "Slight discoloration to purplish red, minor crushed petals",
      C: "Dull brownish petals, damp feel"
    },
    soilTypes: ["Loamy", "Red Soil", "Sandy Loam"],
    expectedProfitPerAcre: 125000,
    typicalPriceRange: { min: 180, max: 320, unit: "kg" },
    sowingSeason: "June - August",
    harvestSeason: "Flushes every 3 weeks",
    defaultImage: "/images/hibiscus.jpg"
  },
  {
    name: "Turmeric",
    hindiName: "हल्दी (Haldi)",
    botanicalName: "Curcuma longa",
    category: "skin care",
    partUsed: "Cured Mother / Finger Rhizomes",
    description: "High curcumin antiseptic rhizome used for glowing skin, blemish clearance and anti-aging.",
    gradeStandards: {
      A: "Curcumin > 4.5%, crisp snap, bright orange-gold core, polished fingers",
      B: "Curcumin 3% - 4.5%, unpolished fingers, sound quality",
      C: "Curcumin < 3%, mother rhizome splits"
    },
    soilTypes: ["Loamy", "Alluvial", "Red Sandy Loam"],
    expectedProfitPerAcre: 140000,
    typicalPriceRange: { min: 90, max: 160, unit: "kg" },
    sowingSeason: "May - July",
    harvestSeason: "January - March",
    defaultImage: "/images/turmeric.jpg"
  },
  {
    name: "Henna",
    hindiName: "मेंहदी (Mehndi)",
    botanicalName: "Lawsonia inermis",
    category: "hair care",
    partUsed: "Dry Leaves",
    description: "Natural cooling dye and conditioning leaf from Sojat belt, builds natural protein bonds on hair.",
    gradeStandards: {
      A: "Lawsone content > 2.5%, fine bright green leaves, triple shade-dried",
      B: "Lawsone 1.8% - 2.5%, greenish-olive leaf fragments",
      C: "Pale olive leaves, coarse texture"
    },
    soilTypes: ["Sandy Loam", "Arid Loam", "Red Soil"],
    expectedProfitPerAcre: 85000,
    typicalPriceRange: { min: 70, max: 135, unit: "kg" },
    sowingSeason: "July - August",
    harvestSeason: "October - November & March - April",
    defaultImage: "/images/henna.jpg"
  },
  {
    name: "Bhringraj",
    hindiName: "भृंगराज (False Daisy)",
    botanicalName: "Eclipta alba",
    category: "herbs",
    partUsed: "Whole Dried Plant (Panchang)",
    description: "King of hair rejuvenation (Keshraj), activates hair follicle anagen phase and stops premature greying.",
    gradeStandards: {
      A: "Whole plant with tiny white flowers and roots intact, green shade-dried, zero grass contamination",
      B: "Crushed dry panchang, mild weed mixing (< 3%)",
      C: "Over-dried blackened stalks"
    },
    soilTypes: ["Clay Loam", "Marshy Moist Soil", "Alluvial"],
    expectedProfitPerAcre: 92000,
    typicalPriceRange: { min: 95, max: 180, unit: "kg" },
    sowingSeason: "March - April / July",
    harvestSeason: "60-70 days after planting",
    defaultImage: "/images/bhringraj.jpg"
  },
  {
    name: "Brahmi",
    hindiName: "ब्राह्मी",
    botanicalName: "Bacopa monnieri",
    category: "herbs",
    partUsed: "Whole Plant / Aerial Leaves",
    description: "Neuro-cooling herb loaded with bacosides, eliminates scalp tension, dry flakes and strengthens roots.",
    gradeStandards: {
      A: "Thick succulent-derived dried green leaves, bacoside A > 2.5%, washed pristine",
      B: "Standard dried aerial parts, bacoside 1.8-2.5%",
      C: "Low bacoside or sandy remnants"
    },
    soilTypes: ["Wet Alluvial", "Moist Loam", "Marshy Clay"],
    expectedProfitPerAcre: 105000,
    typicalPriceRange: { min: 110, max: 210, unit: "kg" },
    sowingSeason: "June - September",
    harvestSeason: "September - November",
    defaultImage: "/images/brahmi.jpg"
  },
  {
    name: "Tulsi",
    hindiName: "तुलसी (Holy Basil)",
    botanicalName: "Ocimum sanctum",
    category: "herbs",
    partUsed: "Dried Leaves & Inflorescence",
    description: "Sacred adaptogen and antiseptic herb, clears scalp pathogens and soothes inflamed skin.",
    gradeStandards: {
      A: "Purple/green leaves with fragrant flowering spikes, eugenol > 65%, shade-dried",
      B: "Clean green dried leaves, pleasant aroma",
      C: "Brownish leaves with thick stems"
    },
    soilTypes: ["Loamy", "Alluvial", "Sandy Loam"],
    expectedProfitPerAcre: 68000,
    typicalPriceRange: { min: 80, max: 150, unit: "kg" },
    sowingSeason: "June - July",
    harvestSeason: "Every 75 days",
    defaultImage: "/images/tulsi.jpg"
  },
  {
    name: "Moringa",
    hindiName: "सहजन (Moringa)",
    botanicalName: "Moringa oleifera",
    category: "health and wellness",
    partUsed: "Solar-Dried Leaf Powder / Whole Leaf",
    description: "Nutrient powerhouse rich in zinc, silica and iron for hair vitality and antioxidant facial creams.",
    gradeStandards: {
      A: "Vibrant emerald green leaflets, zero twigs, moisture < 7%, laboratory tested",
      B: "Light green leaflets, minimal stems (< 2%)",
      C: "Yellow-tinged or coarse particles"
    },
    soilTypes: ["Sandy Loam", "Red Soil", "Alluvial"],
    expectedProfitPerAcre: 88000,
    typicalPriceRange: { min: 75, max: 140, unit: "kg" },
    sowingSeason: "July - August",
    harvestSeason: "Multiple cuttings yearly",
    defaultImage: "/images/moringa.jpg"
  },
  {
    name: "Rose Petals",
    hindiName: "गुलाब की पत्तियां (Desi Gulab)",
    botanicalName: "Rosa damascena",
    category: "flowers",
    partUsed: "Dried Fragrant Petals",
    description: "Damask rose petals distilled into pure rose water and ground for anti-blemish face packs.",
    gradeStandards: {
      A: "Desi fragrant pink petals, gently solar-dried, zero calyx greens, enchanting fragrance",
      B: "Clean petals with slight color fade, good scent",
      C: "Mixed varieties or faded pale petals"
    },
    soilTypes: ["Clay Loam", "Sandy Loam", "Alluvial"],
    expectedProfitPerAcre: 160000,
    typicalPriceRange: { min: 220, max: 450, unit: "kg" },
    sowingSeason: "October - November",
    harvestSeason: "February - April (Early morning plucking)",
    defaultImage: "/images/rose_petals.jpg"
  },
  {
    name: "Coconut",
    hindiName: "नारियल (Khopra / Fresh Kernel)",
    botanicalName: "Cocos nucifera",
    category: "oils",
    partUsed: "Sun-Dried Copra / Cold-Press Kernels",
    description: "Base virgin oil for Ayurvedic tailams, deeply penetrating lauric acid for scalp lipid barrier.",
    gradeStandards: {
      A: "Snow-white copra cups, oil content > 68%, free fatty acid < 0.3%, sulfur-free",
      B: "Clean copra, slight cream color, oil > 65%",
      C: "Smoky or rubbery copra pieces"
    },
    soilTypes: ["Coastal Sandy", "Alluvial", "Laterite"],
    expectedProfitPerAcre: 130000,
    typicalPriceRange: { min: 110, max: 180, unit: "kg" },
    sowingSeason: "June - September",
    harvestSeason: "Monthly flushes",
    defaultImage: "/images/coconut.jpg"
  },
  {
    name: "Almond",
    hindiName: "बादाम (Mamra / Desi Almonds)",
    botanicalName: "Prunus dulcis",
    category: "oils",
    partUsed: "Whole Kernels",
    description: "Rich in sweet almond oil and vitamin E, softens cuticles and rejuvenates sensitive under-eye skin.",
    gradeStandards: {
      A: "Sweet non-bitter mamra kernels, unpeeled whole, oil yield > 52%",
      B: "Standard sweet kernels, sound size",
      C: "Broken or shrivelled kernels"
    },
    soilTypes: ["Deep Loamy", "Alluvial"],
    expectedProfitPerAcre: 180000,
    typicalPriceRange: { min: 550, max: 850, unit: "kg" },
    sowingSeason: "November - December",
    harvestSeason: "August - September",
    defaultImage: "/images/almond.jpg"
  },
  {
    name: "Sandalwood",
    hindiName: "चंदन (Chandan)",
    botanicalName: "Santalum album",
    category: "skin care",
    partUsed: "Legal Certified Heartwood Chips",
    description: "Royalty of Ayurvedic perfumery and cooling complexion treatments with santalol aroma.",
    gradeStandards: {
      A: "Certified forest dept red/golden heartwood chips, oil > 4%, santalol > 90%",
      B: "Heartwood shavings with minimal sapwood",
      C: "Sapwood blended chips"
    },
    soilTypes: ["Red Loam", "Lateritic Soil", "Rocky Sandy Loam"],
    expectedProfitPerAcre: 350000,
    typicalPriceRange: { min: 4500, max: 8500, unit: "kg" },
    sowingSeason: "Monsoon",
    harvestSeason: "Long-term (12-15 yrs, certified)",
    defaultImage: "/images/sandalwood.jpg"
  },
  {
    name: "Curry Leaves",
    hindiName: "कढ़ी पत्ता (Kadi Patta)",
    botanicalName: "Murraya koenigii",
    category: "hair care",
    partUsed: "Dehydrated Aromatic Leaves",
    description: "Packed with beta-carotene and amino acids, prevents premature greying and stimulates dormant hair roots.",
    gradeStandards: {
      A: "Deep forest green dehydrated whole leaves, highly pungent aroma, zero stem debris",
      B: "Standard green leaves, small stems (< 3%)",
      C: "Yellowed dry leaves with faded scent"
    },
    soilTypes: ["Red Sandy Loam", "Black Loam"],
    expectedProfitPerAcre: 72000,
    typicalPriceRange: { min: 50, max: 95, unit: "kg" },
    sowingSeason: "June - August",
    harvestSeason: "Every 60-90 days",
    defaultImage: "/images/curry_leaves.jpg"
  },
  {
    name: "Multani Mitti",
    hindiName: "मुल्तानी मिट्टी (Fuller's Earth)",
    botanicalName: "Solum Fullonum (Natural Bentonite Clay)",
    category: "skin care",
    partUsed: "Raw Natural Clods / Powder",
    description: "Mineral-dense purifying volcanic clay, absorbs excess sebum, detoxifies skin pores and cools scalp.",
    gradeStandards: {
      A: "Light cream smooth clods, grit-free, super fine colloidal texture, zero added salts",
      B: "Natural chunks, minor grit, good oil absorption",
      C: "Gritty clay clods requiring intensive filtering"
    },
    soilTypes: ["Mineral Quarry Formations"],
    expectedProfitPerAcre: 65000,
    typicalPriceRange: { min: 20, max: 45, unit: "kg" },
    sowingSeason: "Non-monsoon mining",
    harvestSeason: "Year-round",
    defaultImage: "/images/multani_mitti.jpg"
  },
  {
    name: "Lavender",
    hindiName: "लैवेंडर",
    botanicalName: "Lavandula angustifolia",
    category: "flowers",
    partUsed: "Dried Buds & Flower Spikes",
    description: "Soothing floral essential oil provider, balances scalp microbiome and imparts calming aroma.",
    gradeStandards: {
      A: "Deep violet-blue buds, rich essential oil aroma, linalool > 35%, zero straw debris",
      B: "Light purple buds, mild aroma",
      C: "Greyish dried stems with faded flowers"
    },
    soilTypes: ["Well-drained Gravelly Loam", "Alkaline Hill Soil"],
    expectedProfitPerAcre: 190000,
    typicalPriceRange: { min: 800, max: 1400, unit: "kg" },
    sowingSeason: "October - November",
    harvestSeason: "June - August",
    defaultImage: "/images/lavender.jpg"
  },
  {
    name: "Ashwagandha",
    hindiName: "अश्वगंधा",
    botanicalName: "Withania somnifera",
    category: "health and wellness",
    partUsed: "Dried Roots",
    description: "Vigor-enhancing adaptogen that balances cortisol, prevents stress-induced hair loss, and heals skin.",
    gradeStandards: {
      A: "Nagori grade brittle white-centered roots, diameter > 1cm, withanolides > 1.5%",
      B: "Medium roots, light cream color, crisp snap",
      C: "Thin woody roots with high fiber"
    },
    soilTypes: ["Sandy Loam", "Red Soil", "Black Cotton Soil"],
    expectedProfitPerAcre: 115000,
    typicalPriceRange: { min: 190, max: 340, unit: "kg" },
    sowingSeason: "August - September",
    harvestSeason: "January - March",
    defaultImage: "/images/ashwagandha.jpg"
  },
  {
    name: "Shatavari",
    hindiName: "शतावरी",
    botanicalName: "Asparagus racemosus",
    category: "herbs",
    partUsed: "Peeled Dried Tuberous Roots",
    description: "Cooling rasayana root containing steroidal saponins that calm skin redness and nourish scalp tissues.",
    gradeStandards: {
      A: "Clean peeled ivory white tubers, plump and sweetish taste, zero moisture",
      B: "Partially peeled yellowish tubers, standard sound roots",
      C: "Unpeeled fibrous rootlets"
    },
    soilTypes: ["Sandy Loam", "Black Loam", "Clay Loam"],
    expectedProfitPerAcre: 135000,
    typicalPriceRange: { min: 210, max: 380, unit: "kg" },
    sowingSeason: "June - July",
    harvestSeason: "After 18-24 months (Winter)",
    defaultImage: "/images/shatavari.jpg"
  },
  {
    name: "Vetiver (Khus)",
    hindiName: "खस (Vetiver)",
    botanicalName: "Chrysopogon zizanioides",
    category: "oils",
    partUsed: "Aromatic Fibrous Roots",
    description: "Deeply earthy cooling grass root, natural fixative and skin toner that pacifies Pitta heat.",
    gradeStandards: {
      A: "Long cleaned golden-brown roots, intensely fragrant, free of soil particles",
      B: "Clean chopped root fibers, good aroma",
      C: "Coarse roots with sand residues"
    },
    soilTypes: ["Sandy Loam", "Alluvial", "Riverbed Soil"],
    expectedProfitPerAcre: 120000,
    typicalPriceRange: { min: 240, max: 420, unit: "kg" },
    sowingSeason: "June - August",
    harvestSeason: "December - February (18 months)",
    defaultImage: "/images/vetiver.jpg"
  },
  {
    name: "Lemongrass",
    hindiName: "लेमनग्रास (हरी चाय)",
    botanicalName: "Cymbopogon citratus",
    category: "oils",
    partUsed: "Dried Stalks & Essential Distillate",
    description: "Crisp citrus aroma herb, astringent and clarifying agent for oily scalp and acne-prone skin.",
    gradeStandards: {
      A: "Green shade-dried cut leaves, citral > 78%, intense lemon scent",
      B: "Yellow-green cuts, citral > 70%",
      C: "Bleached straw stalks"
    },
    soilTypes: ["Sandy Loam", "Red Laterite", "Poor Rocky Soil"],
    expectedProfitPerAcre: 75000,
    typicalPriceRange: { min: 40, max: 80, unit: "kg" },
    sowingSeason: "June - July",
    harvestSeason: "First cut at 90 days, then every 60 days",
    defaultImage: "/images/lemongrass.jpg"
  },
  {
    name: "Chamomile",
    hindiName: "बबूने का फूल (Babuna)",
    botanicalName: "Matricaria chamomilla",
    category: "flowers",
    partUsed: "Dried Flower Heads",
    description: "Bisabolol-loaded gentle blossom that calms itchy sensitive scalps and imparts golden undertones to hair.",
    gradeStandards: {
      A: "Whole golden-yellow center blossoms with intact white florets, shade-dried, zero stems",
      B: "Blossoms with minor stem segments, good aroma",
      C: "Crushed flower chaff"
    },
    soilTypes: ["Sandy Loam", "Light Alluvial Soil"],
    expectedProfitPerAcre: 145000,
    typicalPriceRange: { min: 380, max: 650, unit: "kg" },
    sowingSeason: "October - November",
    harvestSeason: "February - April",
    defaultImage: "/images/chamomile.jpg"
  },
  {
    name: "Manjistha",
    hindiName: "मंजीष्ठा (Indian Madder)",
    botanicalName: "Rubia cordifolia",
    category: "skin care",
    partUsed: "Dried Stems & Woody Roots",
    description: "Celebrated blood purifier and skin depigmenting root, creates natural rosy herbal complexion tones.",
    gradeStandards: {
      A: "Deep blood-red thick barky stems, crisp snap, no mold, purpurin > 1.8%",
      B: "Medium reddish-orange stems, clean quality",
      C: "Thin pale sticks"
    },
    soilTypes: ["Loamy", "Hilly Forest Loam", "Laterite"],
    expectedProfitPerAcre: 130000,
    typicalPriceRange: { min: 140, max: 260, unit: "kg" },
    sowingSeason: "June - August",
    harvestSeason: "After 2 years (Winter)",
    defaultImage: "/images/manjistha.jpg"
  },
  {
    name: "Lodhra",
    hindiName: "लोध्र",
    botanicalName: "Symplocos racemosa",
    category: "skin care",
    partUsed: "Dried Bark",
    description: "Astringent bark that firms skin, stops micro-bleedings, heals acne and controls scalp oiliness.",
    gradeStandards: {
      A: "Thick curved bark pieces, clean buff-brown exterior, zero lichen, moisture < 10%",
      B: "Medium bark fragments, acceptable aroma",
      C: "Thin papery bark shavings"
    },
    soilTypes: ["Laterite", "Hilly Forest Soil"],
    expectedProfitPerAcre: 90000,
    typicalPriceRange: { min: 110, max: 190, unit: "kg" },
    sowingSeason: "Forest perennial sourcing",
    harvestSeason: "Autumn / Winter",
    defaultImage: "/images/lodhra.jpg"
  },
  {
    name: "Nagarmotha",
    hindiName: "नागरमोथा (Nutgrass)",
    botanicalName: "Cyperus rotundus",
    category: "herbs",
    partUsed: "Dried Rhizome Tubers",
    description: "Deeply aromatic rhizome that dissolves sebum plugs, treats dandruff and acts as Ayurvedic fixative.",
    gradeStandards: {
      A: "Plump cleaned dark-brown tubers, strong camphoraceous aroma, washed free of soil",
      B: "Standard dried tubers, clean quality",
      C: "Earthy unwashed tubers"
    },
    soilTypes: ["Clay Loam", "Alluvial", "Black Soil"],
    expectedProfitPerAcre: 85000,
    typicalPriceRange: { min: 80, max: 150, unit: "kg" },
    sowingSeason: "July - August",
    harvestSeason: "November - January",
    defaultImage: "/images/nagarmotha.jpg"
  },
  {
    name: "Mulethi (Licorice)",
    hindiName: "मुलेठी (Yashtimadhu)",
    botanicalName: "Glycyrrhiza glabra",
    category: "skin care",
    partUsed: "Peeled Sweet Roots & Stolons",
    description: "Glabridin powerhouse that fades dark spots, provides natural UV defense and moisturizes brittle hair.",
    gradeStandards: {
      A: "Yellow fibrous sweet interior, diameter > 1.2cm, glycyrrhizin > 4%, peeled sticks",
      B: "Unpeeled sticks, sound sweet taste",
      C: "Thin woody roots with low sweetness"
    },
    soilTypes: ["Sandy Loam", "Deep Rich Alluvial Soil"],
    expectedProfitPerAcre: 155000,
    typicalPriceRange: { min: 160, max: 290, unit: "kg" },
    sowingSeason: "February - March",
    harvestSeason: "After 2.5 - 3 years (Winter)",
    defaultImage: "/images/mulethi.jpg"
  },
  {
    name: "Gotu Kola (Mandukaparni)",
    hindiName: "मंडूकपर्णी (Gotu Kola)",
    botanicalName: "Centella asiatica",
    category: "skin care",
    partUsed: "Whole Dried Creeping Herb",
    description: "Collagen synthesis catalyst that tightens skin elasticity and stimulates microcirculation in hair follicles.",
    gradeStandards: {
      A: "Crisp emerald dried fan leaves with petioles, madecassoside > 2%, solar dehydrated",
      B: "Green-yellow leaf blend, minimal dirt",
      C: "Crushed damp leaves"
    },
    soilTypes: ["Moist Loam", "Marshy Soil", "Humus Rich Soil"],
    expectedProfitPerAcre: 100000,
    typicalPriceRange: { min: 130, max: 240, unit: "kg" },
    sowingSeason: "March - July",
    harvestSeason: "Every 60 days",
    defaultImage: "/images/gotu_kola.jpg"
  },
  {
    name: "Calamus (Vacha)",
    hindiName: "वचा (Sweet Flag)",
    botanicalName: "Acorus calamus",
    category: "herbs",
    partUsed: "Aromatic Rhizomes",
    description: "Spicy-sweet rhizome that stimulates blood flow to roots and acts as natural preservative in hair pastes.",
    gradeStandards: {
      A: "Clean peeled dried rhizome segments, intense spicy scent, zero insect puncture",
      B: "Standard dried rhizomes, sound aroma",
      C: "Thin rhizome pieces"
    },
    soilTypes: ["Marshy Clay", "Wet Alluvial", "Paddy soil"],
    expectedProfitPerAcre: 95000,
    typicalPriceRange: { min: 120, max: 220, unit: "kg" },
    sowingSeason: "June - July",
    harvestSeason: "December - February",
    defaultImage: "/images/calamus.jpg"
  },
  {
    name: "Sesame (Til)",
    hindiName: "तिल (Black & White Sesame)",
    botanicalName: "Sesamum indicum",
    category: "oils",
    partUsed: "Dry Seeds",
    description: "Classic Ayurvedic base oil (Taila), deeply penetrative nourishing oil loaded with sesamol and omega fatty acids.",
    gradeStandards: {
      A: "Bold clean black/white seeds, purity > 99.5%, oil content > 50%",
      B: "Clean seeds, purity > 98%",
      C: "Seeds with fine grit or mixed varieties"
    },
    soilTypes: ["Sandy Loam", "Light Alluvial", "Black Soil"],
    expectedProfitPerAcre: 62000,
    typicalPriceRange: { min: 110, max: 175, unit: "kg" },
    sowingSeason: "June - July (Kharif) / February (Summer)",
    harvestSeason: "90-100 days after sowing",
    defaultImage: "/images/sesame.jpg"
  }
];

const CATEGORIES = [
  "hair care",
  "skin care",
  "health and wellness",
  "oils",
  "flowers",
  "herbs",
  "other"
];

const SOIL_TYPES = [
  "Alluvial",
  "Black Soil",
  "Red Soil",
  "Sandy Loam",
  "Loamy",
  "Clay Loam",
  "Laterite",
  "Arid Soil",
  "Marshy Moist Soil"
];

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" }
];

const ORDER_STATUSES = [
  "Requested",
  "Accepted",
  "Dispatched",
  "Delivered",
  "Paid",
  "Rejected",
  "Cancelled"
];

module.exports = {
  HERBAL_INGREDIENTS,
  CATEGORIES,
  SOIL_TYPES,
  SUPPORTED_LANGUAGES,
  ORDER_STATUSES,
  PLATFORM_COMMISSION_PERCENT: 2.5
};
