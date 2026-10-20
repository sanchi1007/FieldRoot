/**
 * FieldRoot Connect — Navigation & Footer Component Injector
 * Features:
 * - Desktop horizontal navigation with role-aware and localization routing
 * - Off-canvas sliding mobile drawer with backdrop overlay
 * - Prominent mobile user profile card / guest authentication CTAs
 * - Categorized mobile menu with intuitive icons
 * - One-touch mobile language switcher chips
 * - Responsive breakpoints and touch-friendly controls
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
}

const Nav = {
  init() {
    this.renderHeader();
    this.renderFooter();
    this.attachEvents();
    if (typeof I18N !== 'undefined' && I18N.translatePage) {
      I18N.translatePage();
    }
  },

  renderHeader() {
    const headerEl = document.getElementById('site-header');
    if (!headerEl) return;

    const user = Auth.getUser();
    const isLoggedIn = Auth.isLoggedIn();
    const currentPath = window.location.pathname;

    let roleLinksDesktop = '';
    let roleLinksMobile = '';
    let roleTitle = '🌾 Farmer Tools';
    let roleBadgeClass = 'badge-organic';

    if (isLoggedIn && user) {
      if (user.role === 'farmer') {
        roleTitle = '🌾 Farmer Workspace';
        roleBadgeClass = 'badge-organic';
        roleLinksDesktop = `
          <a href="/farmer-dashboard.html" class="nav-link ${currentPath.includes('farmer-dashboard') ? 'active' : ''}" data-i18n="nav_dashboard">Dashboard</a>
          <a href="/my-products.html" class="nav-link ${currentPath.includes('my-products') ? 'active' : ''}" data-i18n="nav_my_products">My Products</a>
          <a href="/add-product.html" class="nav-link ${currentPath.includes('add-product') ? 'active' : ''}" data-i18n="nav_add_product">+ Add Product</a>
          <a href="/orders.html" class="nav-link ${currentPath.includes('orders') ? 'active' : ''}" data-i18n="nav_orders">Orders</a>
          <a href="/earnings.html" class="nav-link ${currentPath.includes('earnings') ? 'active' : ''}" data-i18n="nav_earnings">Earnings</a>
        `;
        roleLinksMobile = `
          <a href="/farmer-dashboard.html" class="mobile-nav-link ${currentPath.includes('farmer-dashboard') ? 'active' : ''}">
            <span class="mobile-link-icon">📊</span> <span data-i18n="nav_dashboard">Dashboard</span>
          </a>
          <a href="/my-products.html" class="mobile-nav-link ${currentPath.includes('my-products') ? 'active' : ''}">
            <span class="mobile-link-icon">🌿</span> <span data-i18n="nav_my_products">My Products</span>
          </a>
          <a href="/add-product.html" class="mobile-nav-link ${currentPath.includes('add-product') ? 'active' : ''}">
            <span class="mobile-link-icon">➕</span> <span data-i18n="nav_add_product">+ Add Product</span>
          </a>
          <a href="/orders.html" class="mobile-nav-link ${currentPath.includes('orders') ? 'active' : ''}">
            <span class="mobile-link-icon">📦</span> <span data-i18n="nav_orders">Orders & Payouts</span>
          </a>
          <a href="/earnings.html" class="mobile-nav-link ${currentPath.includes('earnings') ? 'active' : ''}">
            <span class="mobile-link-icon">💰</span> <span data-i18n="nav_earnings">Earnings & Mandi Delta</span>
          </a>
          <a href="/contracts.html" class="mobile-nav-link ${currentPath.includes('contracts') ? 'active' : ''}">
            <span class="mobile-link-icon">📜</span> <span data-i18n="nav_contracts">Pre-Season Contracts</span>
          </a>
        `;
      } else if (user.role === 'company') {
        roleTitle = '🏢 Sourcing Hub';
        roleBadgeClass = 'badge-grade-a';
        roleLinksDesktop = `
          <a href="/marketplace.html" class="nav-link ${currentPath.includes('marketplace') ? 'active' : ''}" data-i18n="nav_marketplace">Marketplace</a>
          <a href="/contracts.html" class="nav-link ${currentPath.includes('contracts') ? 'active' : ''}" data-i18n="nav_contracts">Contracts</a>
          <a href="/orders.html" class="nav-link ${currentPath.includes('orders') ? 'active' : ''}" data-i18n="nav_orders">Orders & Invoices</a>
          <a href="/earnings.html" class="nav-link ${currentPath.includes('earnings') ? 'active' : ''}">Procurement Analytics</a>
        `;
        roleLinksMobile = `
          <a href="/marketplace.html" class="mobile-nav-link ${currentPath.includes('marketplace') ? 'active' : ''}">
            <span class="mobile-link-icon">🛒</span> <span data-i18n="nav_marketplace">Marketplace</span>
          </a>
          <a href="/contracts.html" class="mobile-nav-link ${currentPath.includes('contracts') ? 'active' : ''}">
            <span class="mobile-link-icon">📜</span> <span data-i18n="nav_contracts">Post / View Contracts</span>
          </a>
          <a href="/orders.html" class="mobile-nav-link ${currentPath.includes('orders') ? 'active' : ''}">
            <span class="mobile-link-icon">📑</span> <span data-i18n="nav_orders">Orders & Invoices</span>
          </a>
          <a href="/earnings.html" class="mobile-nav-link ${currentPath.includes('earnings') ? 'active' : ''}">
            <span class="mobile-link-icon">📊</span> <span>Procurement Analytics</span>
          </a>
        `;
      } else if (user.role === 'admin') {
        roleTitle = '👑 Administration';
        roleBadgeClass = 'badge-trust';
        roleLinksDesktop = `
          <a href="/admin.html" class="nav-link ${currentPath.includes('admin') ? 'active' : ''}" data-i18n="nav_admin">Admin Panel</a>
          <a href="/marketplace.html" class="nav-link ${currentPath.includes('marketplace') ? 'active' : ''}" data-i18n="nav_marketplace">Marketplace</a>
          <a href="/contracts.html" class="nav-link ${currentPath.includes('contracts') ? 'active' : ''}" data-i18n="nav_contracts">Contracts</a>
          <a href="/orders.html" class="nav-link ${currentPath.includes('orders') ? 'active' : ''}" data-i18n="nav_orders">Orders</a>
        `;
        roleLinksMobile = `
          <a href="/admin.html" class="mobile-nav-link ${currentPath.includes('admin') ? 'active' : ''}">
            <span class="mobile-link-icon">⚙️</span> <span data-i18n="nav_admin">Admin Panel</span>
          </a>
          <a href="/marketplace.html" class="mobile-nav-link ${currentPath.includes('marketplace') ? 'active' : ''}">
            <span class="mobile-link-icon">🛒</span> <span data-i18n="nav_marketplace">Marketplace</span>
          </a>
          <a href="/contracts.html" class="mobile-nav-link ${currentPath.includes('contracts') ? 'active' : ''}">
            <span class="mobile-link-icon">📜</span> <span data-i18n="nav_contracts">Contracts</span>
          </a>
          <a href="/orders.html" class="mobile-nav-link ${currentPath.includes('orders') ? 'active' : ''}">
            <span class="mobile-link-icon">📦</span> <span data-i18n="nav_orders">Orders</span>
          </a>
        `;
      }
    }

    const commonLinksDesktop = `
      <a href="/crop-advisor.html" class="nav-link ${currentPath.includes('crop-advisor') ? 'active' : ''}" data-i18n="nav_advisor">Crop Advisor</a>
      <a href="/price-tracker.html" class="nav-link ${currentPath.includes('price-tracker') ? 'active' : ''}" data-i18n="nav_prices">Mandi Prices</a>
      <a href="/weather-calendar.html" class="nav-link ${currentPath.includes('weather') ? 'active' : ''}" data-i18n="nav_weather">Weather</a>
      <a href="/learn.html" class="nav-link ${currentPath.includes('learn') ? 'active' : ''}" data-i18n="nav_learn">Learn</a>
      <a href="/community.html" class="nav-link ${currentPath.includes('community') ? 'active' : ''}" data-i18n="nav_community">Community</a>
    `;

    const commonLinksMobile = `
      <a href="/crop-advisor.html" class="mobile-nav-link ${currentPath.includes('crop-advisor') ? 'active' : ''}">
        <span class="mobile-link-icon">🌾</span> <span data-i18n="nav_advisor">Crop Advisor</span>
      </a>
      <a href="/price-tracker.html" class="mobile-nav-link ${currentPath.includes('price-tracker') ? 'active' : ''}">
        <span class="mobile-link-icon">📈</span> <span data-i18n="nav_prices">Mandi Prices</span>
      </a>
      <a href="/weather-calendar.html" class="mobile-nav-link ${currentPath.includes('weather') ? 'active' : ''}">
        <span class="mobile-link-icon">🌤️</span> <span data-i18n="nav_weather">Weather & Calendar</span>
      </a>
      <a href="/learn.html" class="mobile-nav-link ${currentPath.includes('learn') ? 'active' : ''}">
        <span class="mobile-link-icon">📚</span> <span data-i18n="nav_learn">Herbal Farming Guides</span>
      </a>
      <a href="/community.html" class="mobile-nav-link ${currentPath.includes('community') ? 'active' : ''}">
        <span class="mobile-link-icon">👥</span> <span data-i18n="nav_community">Farmer Q&A Forum</span>
      </a>
      <a href="/traceability.html?batch=BATCH-614608" class="mobile-nav-link ${currentPath.includes('traceability') ? 'active' : ''}">
        <span class="mobile-link-icon">🔍</span> <span>Batch QR Traceability</span>
      </a>
    `;

    // Header actions: auth elements for desktop + chat & hamburger for mobile
    let desktopAuthHtml = '';
    let mobileUserCardHtml = '';
    let quickChatHtml = '';

    if (isLoggedIn && user) {
      const firstName = user.name ? user.name.split(' ')[0] : 'User';
      desktopAuthHtml = `
        <div class="desktop-auth-actions">
          <a href="/chat.html" class="btn btn-outline btn-sm nav-chat-btn" title="Chat">💬 <span class="desktop-only">Chat</span></a>
          <div class="user-badge" style="display:flex;align-items:center;gap:8px;padding:4px 10px;background:#f5ece2;border-radius:20px;border:1px solid #e4d5c7;">
            <span style="font-weight:600;font-size:0.85rem;color:#4a2c2a;">${escapeHtml(firstName)}</span>
            <span class="badge ${roleBadgeClass}" style="text-transform:capitalize;">${escapeHtml(user.role)}</span>
          </div>
          <button id="nav-logout-btn" class="btn btn-outline btn-sm nav-logout-btn" style="border-color:#b33939;color:#b33939;">Logout</button>
        </div>
      `;
      quickChatHtml = `
        <a href="/chat.html" class="mobile-chat-quick-btn" title="Direct Chat" aria-label="Open Chat">
          💬
        </a>
      `;
      mobileUserCardHtml = `
        <div class="mobile-user-card">
          <div class="mobile-user-avatar">${user.role === 'farmer' ? '🌾' : (user.role === 'company' ? '🏢' : '👑')}</div>
          <div class="mobile-user-info">
            <div class="mobile-user-name">${escapeHtml(user.name)}</div>
            <div class="mobile-user-meta">
              <span class="badge ${roleBadgeClass}" style="text-transform:capitalize;">${escapeHtml(user.role)}</span>
              ${user.district ? `<span class="mobile-user-loc">📍 ${escapeHtml(user.district)}${user.state ? ', ' + escapeHtml(user.state) : ''}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    } else {
      desktopAuthHtml = `
        <div class="desktop-auth-actions">
          <a href="/login.html" class="btn btn-outline btn-sm" data-i18n="nav_login">Login</a>
          <a href="/register.html" class="btn btn-primary btn-sm" data-i18n="nav_register">Register</a>
        </div>
      `;
      mobileUserCardHtml = `
        <div class="mobile-guest-card">
          <div style="font-weight:700;color:var(--color-primary);font-size:0.95rem;margin-bottom:4px;">🌿 Welcome to FieldRoot</div>
          <p style="font-size:0.82rem;color:var(--color-text-muted);margin:0 0 12px;line-height:1.4;">
            Direct farmer-to-brand platform for authentic Ayurvedic herbs.
          </p>
          <div style="display:flex;gap:10px;">
            <a href="/login.html" class="btn btn-outline btn-sm" style="flex:1;" data-i18n="nav_login">Login</a>
            <a href="/register.html" class="btn btn-primary btn-sm" style="flex:1;" data-i18n="nav_register">Register</a>
          </div>
        </div>
      `;
    }

    // Language chips for the mobile drawer
    const langChipsHtml = I18N.supportedLanguages.map(l => `
      <button class="mobile-lang-chip ${l.code === I18N.currentLang ? 'active' : ''}" data-lang="${l.code}" type="button">
        <span class="lang-native">${l.nativeName}</span>
        <span class="lang-eng">(${l.name})</span>
      </button>
    `).join('');

    headerEl.innerHTML = `
      <div class="container">
        <div class="header-inner">
          <a href="/index.html" class="brand-logo-wrap" aria-label="FieldRoot Home">
            <div class="brand-icon">🌿</div>
            <div class="brand-text">
              <h1 data-i18n="brand_name">FieldRoot Connect</h1>
              <span data-i18n="tagline">Farmer-First Agri Platform</span>
            </div>
          </a>

          <!-- Desktop Navigation Bar (hidden on <= 1180px) -->
          <nav class="nav-desktop">
            <a href="/index.html" class="nav-link ${currentPath === '/' || currentPath.includes('index') ? 'active' : ''}" data-i18n="nav_home">Home</a>
            ${roleLinksDesktop}
            ${commonLinksDesktop}
          </nav>

          <div class="header-actions">
            <!-- Language Selector Dropdown -->
            <div class="lang-selector-wrap">
              <button id="lang-toggle-btn" class="lang-btn" aria-label="Select Language" aria-haspopup="true">
                🌐 <span id="current-lang-display">English</span> <span class="lang-caret">▾</span>
              </button>
              <div id="lang-dropdown-menu" class="lang-dropdown">
                ${I18N.supportedLanguages.map(l => `
                  <div class="lang-option ${l.code === I18N.currentLang ? 'active' : ''}" data-lang="${l.code}">
                    <span class="lang-option-native">${l.nativeName}</span>
                    <small class="lang-option-eng">(${l.name})</small>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Desktop Auth Actions (hidden on mobile <= 768px) -->
            ${desktopAuthHtml}

            <!-- Mobile Quick Chat (shown on mobile when logged in) -->
            ${quickChatHtml}

            <!-- Animated Mobile Hamburger Toggle -->
            <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle Navigation Menu" aria-expanded="false">
              <span class="hamburger-bar"></span>
              <span class="hamburger-bar"></span>
              <span class="hamburger-bar"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Off-Canvas Drawer Backdrop -->
      <div class="mobile-drawer-backdrop" id="mobile-drawer-backdrop"></div>

      <!-- Mobile Off-Canvas Drawer -->
      <aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation Drawer">
        <!-- Drawer Header -->
        <div class="mobile-drawer-header">
          <div class="brand-logo-wrap">
            <div class="brand-icon" style="width:34px;height:34px;font-size:18px;">🌿</div>
            <div class="brand-text">
              <div style="font-size:1.15rem;font-weight:700;color:var(--color-primary);line-height:1.15;font-family:'Playfair Display',serif;">FieldRoot Connect</div>
              <span style="font-size:0.7rem;color:var(--color-leaf);font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">Fair Herbal Procurement</span>
            </div>
          </div>
          <button class="mobile-drawer-close" id="mobile-drawer-close" aria-label="Close menu">✕</button>
        </div>

        <div class="mobile-drawer-body">
          <!-- User / Auth Card -->
          ${mobileUserCardHtml}

          <!-- Workspace / Role Links (if logged in) -->
          ${isLoggedIn && user ? `
            <div class="mobile-nav-group">
              <div class="mobile-nav-group-title">${roleTitle}</div>
              <div class="mobile-nav-list">
                <a href="/index.html" class="mobile-nav-link ${currentPath === '/' || currentPath.includes('index') ? 'active' : ''}">
                  <span class="mobile-link-icon">🏠</span> <span data-i18n="nav_home">Home</span>
                </a>
                ${roleLinksMobile}
              </div>
            </div>
          ` : `
            <div class="mobile-nav-group">
              <div class="mobile-nav-group-title">🌱 Quick Links</div>
              <div class="mobile-nav-list">
                <a href="/index.html" class="mobile-nav-link ${currentPath === '/' || currentPath.includes('index') ? 'active' : ''}">
                  <span class="mobile-link-icon">🏠</span> <span data-i18n="nav_home">Home</span>
                </a>
                <a href="/marketplace.html" class="mobile-nav-link ${currentPath.includes('marketplace') ? 'active' : ''}">
                  <span class="mobile-link-icon">🛒</span> <span data-i18n="nav_marketplace">Marketplace</span>
                </a>
                <a href="/contracts.html" class="mobile-nav-link ${currentPath.includes('contracts') ? 'active' : ''}">
                  <span class="mobile-link-icon">📜</span> <span data-i18n="nav_contracts">Contracts (20% Advance)</span>
                </a>
              </div>
            </div>
          `}

          <!-- Agro Tools & Resources -->
          <div class="mobile-nav-group">
            <div class="mobile-nav-group-title">🌾 Agro Tools & Knowledge</div>
            <div class="mobile-nav-list">
              ${commonLinksMobile}
              ${isLoggedIn ? `
                <a href="/chat.html" class="mobile-nav-link ${currentPath.includes('chat') ? 'active' : ''}">
                  <span class="mobile-link-icon">💬</span> <span>Direct Chat & Messages</span>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- Quick Language Switcher Grid -->
          <div class="mobile-nav-group">
            <div class="mobile-nav-group-title">🌐 Language (भाषा चुनें)</div>
            <div class="mobile-lang-chips-grid">
              ${langChipsHtml}
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="mobile-drawer-footer">
          ${isLoggedIn ? `
            <button id="mobile-nav-logout-btn" class="btn btn-outline btn-sm mobile-logout-btn" type="button">
              🚪 Logout (${escapeHtml(user.name.split(' ')[0])})
            </button>
          ` : ''}
          <div class="mobile-helpline-box">
            <div style="font-size:0.78rem;color:var(--color-chocolate);font-weight:600;">Farmer Support & Guidance</div>
            <a href="tel:18004197668" style="font-size:0.85rem;color:var(--color-primary);font-weight:700;text-decoration:none;">
              📞 1800-419-ROOT (Toll-Free)
            </a>
          </div>
        </div>
      </aside>
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
    // 1. Desktop & Mobile Language dropdown toggle
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

    // 2. Mobile Off-Canvas Drawer Open/Close controls
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
    const mobileCloseBtn = document.getElementById('mobile-drawer-close');

    const openDrawer = () => {
      if (mobileDrawer) mobileDrawer.classList.add('open');
      if (mobileBackdrop) mobileBackdrop.classList.add('show');
      if (mobileToggle) {
        mobileToggle.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      document.body.classList.add('drawer-open');
    };

    const closeDrawer = () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
      if (mobileBackdrop) mobileBackdrop.classList.remove('show');
      if (mobileToggle) {
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('drawer-open');
    };

    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeDrawer);
    }

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeDrawer);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Auto-close drawer when clicking on any mobile nav link
    if (mobileDrawer) {
      mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          closeDrawer();
        });
      });
    }

    // 3. Mobile Drawer Language Chips
    document.querySelectorAll('.mobile-lang-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        const lang = chip.getAttribute('data-lang');
        await I18N.setLanguage(lang);
        this.updateCurrentLangDisplay();
      });
    });

    // 4. Logout buttons (desktop & mobile drawer)
    const logoutBtn = document.getElementById('nav-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
      });
    }

    const mobileLogoutBtn = document.getElementById('mobile-nav-logout-btn');
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', () => {
        closeDrawer();
        Auth.logout();
      });
    }

    // 5. Listen to language changes to update displays
    window.addEventListener('fieldroot_lang_changed', () => {
      this.updateCurrentLangDisplay();
    });
  },

  updateCurrentLangDisplay() {
    if (typeof I18N === 'undefined') return;
    const cur = I18N.supportedLanguages.find(l => l.code === I18N.currentLang);
    const displayEl = document.getElementById('current-lang-display');
    if (displayEl && cur) {
      displayEl.textContent = cur.nativeName;
    }

    // Update active state in desktop dropdown
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === I18N.currentLang);
    });

    // Update active state on mobile chips
    document.querySelectorAll('.mobile-lang-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-lang') === I18N.currentLang);
    });
  }
};
