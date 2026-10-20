/**
 * FieldRoot Connect — Navigation & Footer Component Injector
 */

const Nav = {
  init() {
    this.renderHeader();
    this.renderFooter();
    this.attachEvents();
  },

  renderHeader() {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    const user = Auth.getUser();
    const isLoggedIn = Auth.isLoggedIn();
    const currentPath = window.location.pathname;

    let roleLinks = '';
    if (isLoggedIn && user) {
      if (user.role === 'farmer') {
        roleLinks = `
          <a href="/farmer-dashboard.html" class="nav-link ${currentPath.includes('farmer-dashboard') ? 'active' : ''}" data-i18n="nav_dashboard">Dashboard</a>
          <a href="/my-products.html" class="nav-link ${currentPath.includes('my-products') ? 'active' : ''}" data-i18n="nav_my_products">My Products</a>
          <a href="/add-product.html" class="nav-link ${currentPath.includes('add-product') ? 'active' : ''}" data-i18n="nav_add_product">+ Add Product</a>
          <a href="/orders.html" class="nav-link ${currentPath.includes('orders') ? 'active' : ''}" data-i18n="nav_orders">Orders</a>
          <a href="/earnings.html" class="nav-link ${currentPath.includes('earnings') ? 'active' : ''}" data-i18n="nav_earnings">Earnings</a>
        `;
      } else if (user.role === 'company') {
        roleLinks = `
          <a href="/marketplace.html" class="nav-link ${currentPath.includes('marketplace') ? 'active' : ''}" data-i18n="nav_marketplace">Marketplace</a>
          <a href="/contracts.html" class="nav-link ${currentPath.includes('contracts') ? 'active' : ''}" data-i18n="nav_contracts">Contracts</a>
          <a href="/orders.html" class="nav-link ${currentPath.includes('orders') ? 'active' : ''}" data-i18n="nav_orders">Orders & Invoices</a>
          <a href="/earnings.html" class="nav-link ${currentPath.includes('earnings') ? 'active' : ''}">Procurement Analytics</a>
        `;
      } else if (user.role === 'admin') {
        roleLinks = `
          <a href="/admin.html" class="nav-link ${currentPath.includes('admin') ? 'active' : ''}" data-i18n="nav_admin">Admin Panel</a>
          <a href="/marketplace.html" class="nav-link" data-i18n="nav_marketplace">Marketplace</a>
          <a href="/contracts.html" class="nav-link" data-i18n="nav_contracts">Contracts</a>
          <a href="/orders.html" class="nav-link" data-i18n="nav_orders">Orders</a>
        `;
      }
    }

    const commonLinks = `
      <a href="/crop-advisor.html" class="nav-link ${currentPath.includes('crop-advisor') ? 'active' : ''}" data-i18n="nav_advisor">Crop Advisor</a>
      <a href="/price-tracker.html" class="nav-link ${currentPath.includes('price-tracker') ? 'active' : ''}" data-i18n="nav_prices">Mandi Prices</a>
      <a href="/weather-calendar.html" class="nav-link ${currentPath.includes('weather') ? 'active' : ''}" data-i18n="nav_weather">Weather</a>
      <a href="/learn.html" class="nav-link ${currentPath.includes('learn') ? 'active' : ''}" data-i18n="nav_learn">Learn</a>
      <a href="/community.html" class="nav-link ${currentPath.includes('community') ? 'active' : ''}" data-i18n="nav_community">Community</a>
    `;

    let userActionHtml = '';
    if (isLoggedIn && user) {
      userActionHtml = `
        <a href="/chat.html" class="btn btn-outline btn-sm" title="Chat">💬 <span class="desktop-only">Chat</span></a>
        <div class="user-badge" style="display:flex;align-items:center;gap:8px;padding:4px 10px;background:#f5ece2;border-radius:20px;border:1px solid #e4d5c7;">
          <span style="font-weight:600;font-size:0.85rem;color:#4a2c2a;">${user.name.split(' ')[0]}</span>
          <span class="badge ${user.role === 'farmer' ? 'badge-organic' : 'badge-grade-a'}" style="text-transform:capitalize;">${user.role}</span>
        </div>
        <button id="nav-logout-btn" class="btn btn-outline btn-sm" style="border-color:#b33939;color:#b33939;">Logout</button>
      `;
    } else {
      userActionHtml = `
        <a href="/login.html" class="btn btn-outline btn-sm" data-i18n="nav_login">Login</a>
        <a href="/register.html" class="btn btn-primary btn-sm" data-i18n="nav_register">Register</a>
      `;
    }

    headerEl.innerHTML = `
      <div class="container">
        <div class="header-inner">
          <a href="/index.html" class="brand-logo-wrap">
            <div class="brand-icon">🌿</div>
            <div class="brand-text">
              <h1 data-i18n="brand_name">FieldRoot Connect</h1>
              <span data-i18n="tagline">Farmer-First Agri Platform</span>
            </div>
          </a>

          <nav class="nav-desktop">
            <a href="/index.html" class="nav-link ${currentPath === '/' || currentPath.includes('index') ? 'active' : ''}" data-i18n="nav_home">Home</a>
            ${roleLinks}
            ${commonLinks}
          </nav>

          <div class="header-actions">
            <!-- Language Selector -->
            <div class="lang-selector-wrap">
              <button id="lang-toggle-btn" class="lang-btn" aria-label="Select Language">
                🌐 <span id="current-lang-display">English</span> ▾
              </button>
              <div id="lang-dropdown-menu" class="lang-dropdown">
                ${I18N.supportedLanguages.map(l => `
                  <div class="lang-option" data-lang="${l.code}">
                    <span>${l.nativeName}</span>
                    <small style="opacity:0.7;">(${l.name})</small>
                  </div>
                `).join('')}
              </div>
            </div>

            ${userActionHtml}

            <!-- Mobile Hamburger Toggle -->
            <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Open Menu">☰</button>
          </div>
        </div>
      </div>

      <!-- Mobile Drawer Menu -->
      <div class="mobile-drawer" id="mobile-drawer">
        <a href="/index.html" class="nav-link" data-i18n="nav_home">Home</a>
        ${roleLinks}
        ${commonLinks}
      </div>
    `;

    this.updateCurrentLangDisplay();
  },

  renderFooter() {
    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    footerEl.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
              <div class="brand-icon" style="width:36px;height:36px;font-size:18px;">🌿</div>
              <h3 style="color:#ffffff;margin:0;font-size:1.3rem;">FieldRoot Connect</h3>
            </div>
            <p style="font-size:0.9rem;color:#e8dcd0;line-height:1.6;margin-bottom:16px;">
              Direct herbal cosmetics procurement platform empowering Indian farmers with guaranteed buyback, 20% advance contracts, and zero middlemen commissions.
            </p>
            <p style="font-size:0.85rem;color:#c68b59;">
              ★ Proudly crafted for FieldRoot Herbal Hair Wash Powder
            </p>
          </div>

          <div class="footer-col">
            <h4>Farmer Features</h4>
            <ul class="footer-links">
              <li><a href="/add-product.html">Sell Herbal Harvest</a></li>
              <li><a href="/contracts.html">Pre-Season Contracts (20% Advance)</a></li>
              <li><a href="/crop-advisor.html">Soil & Crop Advisor</a></li>
              <li><a href="/price-tracker.html">Live Mandi Prices</a></li>
              <li><a href="/weather-calendar.html">Seasonal Sowing Calendar</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Herbal Knowledge</h4>
            <ul class="footer-links">
              <li><a href="/learn.html">Jeevamrutha Composting Guide</a></li>
              <li><a href="/learn.html">Natural 5-Leaf Pest Spray</a></li>
              <li><a href="/learn.html">Quality Grades A/B/C Standards</a></li>
              <li><a href="/community.html">Farmer Peer Q&A Forum</a></li>
              <li><a href="/traceability.html?batch=BATCH-614608">Batch Traceability Verification</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>FieldRoot Sourcing Hub</h4>
            <p style="font-size:0.88rem;color:#f0e2d3;margin-bottom:8px;">
              📍 Plot 14, Ayurvedic Agri Industrial Zone, Hadapsar, Pune, Maharashtra 411028
            </p>
            <p style="font-size:0.88rem;color:#f0e2d3;margin-bottom:8px;">
              📞 Farmer Helpline: 1800-419-ROOT (Toll-Free)
            </p>
            <p style="font-size:0.88rem;color:#f0e2d3;">
              ✉️ direct-farm@fieldroot.in
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 FieldRoot Natural Cosmetics Pvt. Ltd. | Farmer-First Fair Trade Technology | All Rights Reserved.</p>
        </div>
      </div>
    `;
  },

  attachEvents() {
    // Language dropdown toggle
    const toggleBtn = document.getElementById('lang-toggle-btn');
    const dropdown = document.getElementById('lang-dropdown-menu');

    if (toggleBtn && dropdown) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('show');
      });

      dropdown.querySelectorAll('.lang-option').forEach((opt) => {
        opt.addEventListener('click', async () => {
          const lang = opt.getAttribute('data-lang');
          await I18N.setLanguage(lang);
          this.updateCurrentLangDisplay();
          dropdown.classList.remove('show');
        });
      });
    }

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
      });
    }

    // Listen to language changes to update active selection
    window.addEventListener('fieldroot_lang_changed', () => {
      this.updateCurrentLangDisplay();
    });
  },

  updateCurrentLangDisplay() {
    const cur = I18N.supportedLanguages.find(l => l.code === I18N.currentLang);
    const displayEl = document.getElementById('current-lang-display');
    if (displayEl && cur) {
      displayEl.textContent = cur.nativeName;
    }
  }
};
