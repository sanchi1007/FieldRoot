const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'frontend', 'images');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const images = [
  { name: 'reetha.jpg', title: 'Reetha / Soapnut', color: '#6f4e37', icon: '🌰' },
  { name: 'shikakai.jpg', title: 'Shikakai Pods', color: '#4a2c2a', icon: '🌿' },
  { name: 'neem.jpg', title: 'Organic Neem Leaves', color: '#386641', icon: '🍃' },
  { name: 'fenugreek.jpg', title: 'Amber Fenugreek (Methi)', color: '#c68b59', icon: '🌾' },
  { name: 'aloe_vera.jpg', title: 'Aloe Vera Barbadensis', color: '#2d6a4f', icon: '🌱' },
  { name: 'amla.jpg', title: 'Indian Gooseberry (Amla)', color: '#588157', icon: '🍏' },
  { name: 'hibiscus.jpg', title: 'Crimson Red Hibiscus', color: '#9b2226', icon: '🌺' },
  { name: 'turmeric.jpg', title: 'Curcumin Turmeric', color: '#d4a373', icon: '🍠' },
  { name: 'henna.jpg', title: 'Sojat Organic Henna', color: '#606c38', icon: '🌿' },
  { name: 'ashwagandha.jpg', title: 'Nagori Ashwagandha', color: '#bc6c25', icon: '🪵' },
  { name: 'chamomile.jpg', title: 'German Chamomile', color: '#dda15e', icon: '🌼' },
  { name: 'moringa.jpg', title: 'Moringa Superleaf', color: '#40916c', icon: '🌿' },
  { name: 'curry_leaves.jpg', title: 'Aromatic Curry Leaves', color: '#1b4332', icon: '🍃' },
  { name: 'rose_petals.jpg', title: 'Desi Rose Petals', color: '#b5179e', icon: '🌹' },
  { name: 'coconut.jpg', title: 'Copra Kernel', color: '#7f5539', icon: '🥥' },
  { name: 'sandalwood.jpg', title: 'Chandan Heartwood', color: '#9c6644', icon: '🪵' },
  { name: 'placeholder_herb.jpg', title: 'FieldRoot Ayurvedic Herb', color: '#5f3937', icon: '🌿' },
  { name: 'tip_jeevamrutha.jpg', title: 'Jeevamrutha Composting', color: '#588157', icon: '🧪' },
  { name: 'tip_quality.jpg', title: 'Quality Grading Standards', color: '#c59b27', icon: '🔬' },
  { name: 'tip_pest.jpg', title: 'Natural 5-Leaf Spray', color: '#386641', icon: '🛡️' },
  { name: 'tip_drying.jpg', title: 'Solar Shade Dehydration', color: '#c68b59', icon: '☀️' },
  { name: 'banner_herbs.jpg', title: 'FieldRoot Botanical Harvest', color: '#4a2c2a', icon: '🌾' }
];

images.forEach((img) => {
  const filePath = path.join(imgDir, img.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg-${img.name.replace('.jpg', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${img.color}" />
      <stop offset="100%" stop-color="#2a1a19" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#bg-${img.name.replace('.jpg', '')})" />
  <circle cx="300" cy="170" r="75" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
  <text x="300" y="195" font-size="62" text-anchor="middle">${img.icon}</text>
  <text x="300" y="295" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#ffffff" text-anchor="middle">${img.title}</text>
  <text x="300" y="325" font-family="sans-serif" font-size="14" fill="#e0d2c5" text-anchor="middle">FieldRoot Verified Botanical Harvest</text>
</svg>`;
  fs.writeFileSync(filePath, svg);
});

console.log('✅ Generated ' + images.length + ' botanical visual assets in /public/images');
