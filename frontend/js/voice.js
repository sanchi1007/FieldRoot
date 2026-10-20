/**
 * FieldRoot Connect — Web Speech API Voice Input Helper
 * Allows low-literacy farmers to speak product names, descriptions, and quantities
 */

const VoiceInput = {
  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  getSpeechLang(langCode) {
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      bn: 'bn-IN',
      pa: 'pa-IN'
    };
    return langMap[langCode] || 'hi-IN';
  },

  /**
   * Attach voice listener to an input or textarea
   * @param {string} targetInputId ID of input/textarea to receive speech text
   * @param {string} buttonId ID of microphone trigger button
   */
  attach(targetInputId, buttonId) {
    const target = document.getElementById(targetInputId);
    const btn = document.getElementById(buttonId);

    if (!target || !btn) return;

    if (!this.isSupported()) {
      btn.style.display = 'none';
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      if (isListening) {
        recognition.stop();
        return;
      }

      const activeLang = I18N.currentLang || 'hi';
      recognition.lang = this.getSpeechLang(activeLang);

      try {
        recognition.start();
        isListening = true;
        btn.classList.add('listening');
        showToast(`🎙️ Listening in ${activeLang.toUpperCase()}... Please speak.`, 'info', 2500);
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (target.tagName.toLowerCase() === 'textarea') {
        target.value = target.value ? `${target.value} ${transcript}` : transcript;
      } else {
        target.value = transcript;
      }
      showToast(`✓ Voice captured: "${transcript}"`, 'success');
    };

    recognition.onerror = (event) => {
      console.warn('Speech error:', event.error);
      btn.classList.remove('listening');
      isListening = false;
      if (event.error === 'not-allowed') {
        showToast('Microphone access was denied. Please allow microphone in browser.', 'error');
      }
    };

    recognition.onend = () => {
      btn.classList.remove('listening');
      isListening = false;
    };
  }
};
