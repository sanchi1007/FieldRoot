# 🌿 FieldRoot Connect — Farmer-First Agri Platform

**FieldRoot Connect** is a full-stack, direct farm-to-bottle agricultural trading and advisory platform connecting certified organic herbal growers with **FieldRoot Herbal Cosmetics** (producers of all-natural chemical-free hair care and skin care formulations like the flagship *Herbal Hair Wash Powder* made of pure Reetha, Shikakai, Neem, and Fenugreek).

The platform eliminates middlemen traders who extract 25%–40% wholesale commissions, gives farmers guaranteed pre-season buyback contracts with **20% advance mobilization cash**, provides data-driven agronomic advisors, and delivers complete QR-code batch traceability to retail consumers.

---

## 🎨 Theme & Design System

- **Warm Earthy Brown Palette**:
  - Deep Brown: `#4a2c2a` (Primary brand color)
  - Chocolate: `#6f4e37` (Secondary cards & accents)
  - Warm Caramel: `#c68b59` (Highlight & interactive states)
  - Cream: `#f5ebe0` / `#fbf6f0` (Warm soft backgrounds)
  - Leaf Green: `#5c7a3a` (Organic agri indicators)
  - Gold Foil: `#c59b27` (Quality grade markers)
- **Typography**:
  - Headings: `Playfair Display`, serif (Ayurvedic heritage feel)
  - Body & UI: `Poppins`, sans-serif (Clean, mobile-first legibility)
- **Farmer-Friendly UI**: High contrast, oversized tap targets, step-by-step progress bars, and **Web Speech API voice input** for low-literacy users.

---

## 🚀 Strict Technology Stack

- **Frontend**: Plain HTML5, CSS3, Vanilla JavaScript (zero frontend frameworks)
- **Backend**: Node.js + Express (`index.js`)
- **Database**: MongoDB with Mongoose ODM (10 relational models)
- **Authentication**: JWT (JSON Web Tokens) + `bcryptjs` password hashing with role-based access control (`farmer`, `company`, `admin`)
- **Image Processing**: Multer (stores photos in `/uploads`)
- **Traceability**: Dynamic QR code generation (`qrcode` npm package)
- **Multi-Language**: 9 Indian languages (`en`, `hi`, `mr`, `gu`, `ta`, `te`, `kn`, `bn`, `pa`) loaded via asynchronous JSON dictionary files.

---

## 📁 Folder Structure

```
fieldroot/
├── config/
│   ├── db.js                     # MongoDB connection handler
│   └── constants.js              # 30+ Ayurvedic crops, grade benchmarks, soil maps
├── controllers/
│   ├── adminController.js        # Admin KPIs, verification, moderation
│   ├── advisorController.js      # Soil & profit recommendation engine
│   ├── authController.js         # Register, login, language persistence
│   ├── chatController.js         # Direct farmer-buyer chat threads
│   ├── contractController.js     # Pre-season buyback agreements & 20% advance
│   ├── earningsController.js     # Farmer revenue charts & mandi comparisons
│   ├── orderController.js        # Order tracking & 2.5% commission invoices
│   ├── priceController.js        # APMC Mandi price benchmarks vs direct rates
│   ├── productController.js      # Product listings, search, filters & QR code
│   ├── tipController.js          # Organic farming & quality grade manuals
│   ├── traceabilityController.js # Public batch passport & farm origin story
│   └── weatherController.js      # Live weather advisories & seasonal calendar
├── middleware/
│   ├── auth.js                   # JWT verification & role authorization guards
│   └── upload.js                 # Multer photo upload handler for /uploads
├── models/
│   ├── Contract.js               # Contract farming agreement model
│   ├── Message.js                # Direct chat message model
│   ├── Order.js                  # Orders, invoices & tracking model
│   ├── Payment.js                # Advance, settlement & commission model
│   ├── PriceRecord.js            # Mandi benchmark price record model
│   ├── Product.js                # Farmer harvest listing model
│   ├── Question.js               # Community forum Q&A model
│   ├── Rating.js                 # Trust score & quality review model
│   ├── Tip.js                    # Illustrated guide model
│   └── User.js                   # Farmer, Company & Admin account model
├── public/
│   ├── css/
│   │   └── style.css             # Warm earthy Ayurvedic responsive styling
│   ├── images/                   # Real botanical harvest visuals & icons
│   ├── js/
│   │   ├── api.js                # Unified HTTP client & toast notifications
│   │   ├── auth.js               # Session state & protected route guards
│   │   ├── i18n.js               # 9-language translation engine
│   │   ├── nav.js                # Dynamic header, language selector, & footer
│   │   └── voice.js              # Web Speech API voice input controller
│   ├── lang/                     # en, hi, mr, gu, ta, te, kn, bn, pa JSON files
│   ├── add-product.html          # Add product harvest listing form
│   ├── admin.html                # Platform admin governance panel
│   ├── chat.html                 # Direct messaging interface
│   ├── community.html            # Farmer peer Q&A forum
│   ├── contracts.html            # Pre-season contract farming page
│   ├── crop-advisor.html         # Soil & profit recommendation advisor
│   ├── earnings.html             # Farmer revenue & company sourcing analytics
│   ├── farmer-dashboard.html     # Farmer command center & demand alerts
│   ├── index.html                # Landing page & brand story
│   ├── learn.html                # Organic composting & quality manuals
│   ├── login.html                # Account login with demo autofill
│   ├── marketplace.html          # B2B herbal procurement marketplace
│   ├── my-products.html          # Farmer inventory & views dashboard
│   ├── orders.html               # Order tracking & commission invoice view
│   ├── price-tracker.html        # Live Mandi vs FieldRoot price comparison
│   ├── product-detail.html       # Harvest specs, QR code & buy request modal
│   ├── register.html             # Multi-lingual farmer / buyer registration
│   ├── traceability.html         # Public batch verification & printable QR label
│   └── weather-calendar.html     # District weather & seasonal crop timetable
├── uploads/                      # Uploaded harvest photos
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── create_images.js              # Visual asset generator
├── index.js                      # Express server entry point
├── package.json                  # Dependencies & scripts
└── seed.js                       # 30+ ingredients & sample dataset seed script
```

---

## ⚡ Installation & Quick Start

### 1. Prerequisites
- **Node.js** v18+ installed (`node -v`)
- **MongoDB** running locally on port 27017 or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure `.env`
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your MongoDB connection string is set:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fieldroot_connect
JWT_SECRET=fieldroot_super_secure_jwt_secret_2026_herbal_organics
JWT_EXPIRES_IN=7d
PLATFORM_COMMISSION_PERCENT=2.5
OPENWEATHER_API_KEY=sample_or_demo_key
BASE_URL=http://localhost:5000
```

### 4. Seed the Database
Populate 30+ Ayurvedic ingredients, verified farmers, sample products, contracts, mandi price comparisons, organic guides, and community Q&A:
```bash
npm run seed
```

### 5. Start the Server
```bash
npm start
```
Open **`http://localhost:5000`** in any modern web browser.

---

## 👥 Demo Logins for Instant Testing

| Role | Phone | Password | Name & Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `9876543210` | `password123` | Dr. Aruna Joshi (FieldRoot Quality Director) |
| **Company Buyer** | `9822011223` | `password123` | Vikramaditya Shinde (FieldRoot Sourcing Head) |
| **Farmer (MH)** | `9421055501` | `password123` | Rameshwar Patil (Satara - Reetha, Shikakai, Neem) |
| **Farmer (GJ)** | `9825012345` | `password123` | Suresh Patel (Mehsana - Aloe Vera, Fenugreek) |
| **Farmer (TN)** | `9443098765` | `password123` | Murugan Sundaram (Salem - Crimson Hibiscus) |
| **Farmer (RJ)** | `9414076543` | `password123` | Devendra Singh (Pali - Sojat Henna, Ashwagandha) |
| **Farmer (PB)** | `9815044321` | `password123` | Harpreet Singh (Ludhiana - Chamomile, Methi) |

*(The login screen at `/login.html` features one-click buttons to automatically fill these credentials).*

---

## 📖 REST API Reference with Example Requests

### 1. Authentication (`/api/auth`)

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kisanrao Jadhav",
    "phone": "9822334455",
    "password": "password123",
    "role": "farmer",
    "village": "Wai",
    "district": "Satara",
    "state": "Maharashtra",
    "farmSize": 5,
    "soilType": "Black Soil",
    "preferredLanguage": "mr"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "9421055501", "password": "password123"}'
```

---

### 2. Products Marketplace (`/api/products`)

#### Browse Marketplace with Filters
```bash
curl -X GET "http://localhost:5000/api/products?category=hair%20care&state=Maharashtra&isOrganic=true"
```

#### List Master 30+ Ingredients
```bash
curl -X GET http://localhost:5000/api/products/ingredients-list
```

#### Farmer Create Product Listing
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <TOKEN>" \
  -F "name=Reetha (Soapnut / Aritha)" \
  -F "category=hair care" \
  -F "quantity=300" \
  -F "unit=kg" \
  -F "pricePerUnit=95" \
  -F "isOrganic=true" \
  -F "qualityGrade=Grade A (Export / Prime)" \
  -F "description=Sun-dried destoned pericarp shells"
```

---

### 3. Pre-Season Contract Farming (`/api/contracts`)

#### View Open Contracts
```bash
curl -X GET http://localhost:5000/api/contracts?status=open
```

#### Farmer Accept Contract (Locks 20% Advance)
```bash
curl -X POST http://localhost:5000/api/contracts/<CONTRACT_ID>/accept \
  -H "Authorization: Bearer <TOKEN>"
```

---

### 4. Orders, Invoices & Counter-Offers (`/api/orders`)

#### Company Submit Buy Request
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "<PRODUCT_ID>",
    "quantity": 200,
    "offeredPricePerUnit": 95,
    "deliveryAddress": "FieldRoot Sourcing Warehouse, Pune"
  }'
```

#### Submit Counter-Offer
```bash
curl -X POST http://localhost:5000/api/orders/<ORDER_ID>/counter \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"counterPricePerUnit": 105, "message": "High active saponin Grade A batch"}'
```

#### Dispatch Order (Farmer)
```bash
curl -X POST http://localhost:5000/api/orders/<ORDER_ID>/dispatch \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"courierName": "VRL Logistics", "trackingNumber": "VRL-PUN-77291"}'
```

#### Rate Farmer Quality (Company)
```bash
curl -X POST http://localhost:5000/api/orders/<ORDER_ID>/rate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "purityScore": 5, "comment": "Moisture < 9%, passed lab purity benchmarks"}'
```

---

### 5. Crop Advisor & Demand Alerts (`/api/advisor`)

#### Query Crop Recommendations by Soil Type
```bash
curl -X POST http://localhost:5000/api/advisor/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "district": "Satara",
    "soilType": "Black Soil",
    "waterSource": "Canal Irrigated",
    "farmSize": 3
  }'
```

#### Fetch Active Company Demand Notices
```bash
curl -X GET http://localhost:5000/api/advisor/demand-alerts
```

---

### 6. Mandi Benchmark Prices (`/api/prices`)

#### Query Mandi Comparison Records
```bash
curl -X GET "http://localhost:5000/api/prices?state=Maharashtra"
```

---

### 7. Batch Traceability Verification (`/api/traceability`)

#### Public Batch Origin Query
```bash
curl -X GET http://localhost:5000/api/traceability/BATCH-614608
```

---

## 🛡️ Transparent Fair-Trade Business Model

```
+-------------------------------------------------------------+
|                      ORDER INVOICE                          |
|                                                             |
|  200 kg Reetha @ ₹95/kg                                     |
|  Subtotal:                                     ₹19,000.00   |
|  Platform Commission (2.5% Buyer-Side):           ₹475.00   |
|  ---------------------------------------------------------  |
|  Total Buyer Payable:                          ₹19,475.00   |
|                                                             |
|  ★ Farmer Payout: ₹19,000.00 (100% - ZERO DEDUCTIONS)       |
+-------------------------------------------------------------+
```

1. **Platform Commission**: The 2.5% fee is paid strictly by the buyer. Farmers receive **100% of their agreed price** without commission cuts or weighing deductions.
2. **20% Pre-Season Advance**: Once a farmer accepts a pre-season contract, mobilization funds are disbursed upfront so growers can purchase organic inputs without taking loans from moneylenders.
3. **Traceability QR Stamp**: Every farm batch generates a unique QR code printable on FieldRoot cosmetic packaging, letting end consumers scan and meet the grower.

---

## 📜 License
Distributed under the ISC License. Built with pair-programming care for Indian farmers and ethical Ayurvedic cosmetics.
