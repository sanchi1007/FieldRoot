/**
 * FieldRoot Connect — Multi-language Engine
 * Supports: English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Bengali, Punjabi
 */

const I18N = {
  currentLang: 'en',
  translations: {},
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
  ],

  async init() {
    // 1. Priority: Saved in localStorage -> User Profile in DB -> Browser default -> 'en'
    const storedLang = localStorage.getItem('fieldroot_lang');
    const user = Auth.getUser();

    if (user && user.preferredLanguage) {
      this.currentLang = user.preferredLanguage;
    } else if (storedLang) {
      this.currentLang = storedLang;
    } else {
      this.currentLang = 'en';
    }

    await this.loadLanguage(this.currentLang);
  },

  async loadLanguage(langCode) {
    try {
      const response = await fetch(`/lang/${langCode}.json`);
      if (!response.ok) {
        throw new Error(`Could not load ${langCode}.json`);
      }
      this.translations = await response.json();
      this.currentLang = langCode;
      localStorage.setItem('fieldroot_lang', langCode);

      // Translate DOM
      this.translatePage();

      // Trigger event for custom components
      window.dispatchEvent(new CustomEvent('fieldroot_lang_changed', { detail: { lang: langCode } }));
    } catch (err) {
      console.warn(`Failed loading lang ${langCode}, falling back to English:`, err);
      if (langCode !== 'en') {
        await this.loadLanguage('en');
      }
    }
  },

  async setLanguage(langCode) {
    await this.loadLanguage(langCode);

    // If user is logged in, sync with backend user profile
    if (Auth.isLoggedIn()) {
      try {
        await API.put('/auth/update-language', { language: langCode });
        const user = Auth.getUser();
        if (user) {
          user.preferredLanguage = langCode;
          localStorage.setItem('fieldroot_user', JSON.stringify(user));
        }
      } catch (e) {
        console.warn('Failed to persist language in DB:', e.message);
      }
    }
  },

  t(key, fallback = '') {
    return this.translations[key] || fallback || key;
  },

  translatePage() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (this.translations[key]) {
        el.textContent = this.translations[key];
      }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (this.translations[key]) {
        el.setAttribute('placeholder', this.translations[key]);
      }
    });

    // Titles
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (this.translations[key]) {
        el.setAttribute('title', this.translations[key]);
      }
    });
  }
};
