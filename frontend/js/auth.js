/**
 * FieldRoot Connect — Authentication & Session Manager
 */

const Auth = {
  TOKEN_KEY: 'fieldroot_jwt_token',
  USER_KEY: 'fieldroot_user',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  setSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    if (user.preferredLanguage) {
      localStorage.setItem('fieldroot_lang', user.preferredLanguage);
    }
  },

  clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  logout() {
    this.clearSession();
    window.location.href = '/login.html';
  },

  /**
   * Protected page guard: redirects to login if unauthenticated or unauthorized
   * @param {Array<string>} allowedRoles
   */
  requireAuth(allowedRoles = []) {
    if (!this.isLoggedIn()) {
      sessionStorage.setItem('redirect_after_login', window.location.pathname + window.location.search);
      window.location.href = '/login.html';
      return false;
    }

    const user = this.getUser();
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
      alert(`Access restricted to ${allowedRoles.join('/')} accounts.`);
      window.location.href = user.role === 'farmer' ? '/farmer-dashboard.html' : '/marketplace.html';
      return false;
    }
    return true;
  }
};
