/**
 * ZTools Persona System
 * Handles user identity and adaptive UI filtering
 */

const PERSONAS = {
  DEV: 'dev',
  PRO: 'pro',
  FINANCE: 'finance',
  CREATOR: 'creator',
  NONE: 'none'
};

const PersonaManager = {
  current: localStorage.getItem('ztools_persona') || PERSONAS.NONE,

  init() {
    this.applyToUI();
    this.setupEventListeners();
  },

  set(persona) {
    if (Object.values(PERSONAS).includes(persona)) {
      this.current = persona;
      localStorage.setItem('ztools_persona', persona);
      this.applyToUI();

      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('ztools:personaChanged', { detail: persona }));

      // Log for behavioral learning (future)
      console.log(`Persona set to: ${persona}`);
    }
  },

  applyToUI() {
    document.documentElement.setAttribute('data-persona', this.current);

    // Update Switcher UI if it exists
    const switcher = document.getElementById('persona-current-label');
    if (switcher) {
      const labelMap = {
        'dev': '👨‍💻 Developer',
        'pro': '👩‍💼 Professional',
        'finance': '💰 Investor',
        'creator': '🎨 Creator',
        'none': '🎯 Select Identity'
      };
      switcher.textContent = labelMap[this.current] || labelMap.none;
    }

    // Apply filtering on Homepage Masonry
    this.filterTools();
  },

  filterTools() {
    const tools = document.querySelectorAll('.tool-card-wrapper, .tool-card');
    const isVi = document.documentElement.lang === 'vi';

    if (tools.length === 0) return;

    tools.forEach(el => {
      // Find attributes from self or parent tool-card
      const personas = el.getAttribute('data-personas') || '';
      const isVnOnly = el.getAttribute('data-vn-only') === 'true';

      // 1. Regional Filtering (Hide VN-only tools for non-VN users)
      if (!isVi && isVnOnly) {
        el.style.display = 'none';
        return;
      } else {
        el.style.display = '';
      }

      // 2. Persona Filtering
      // Apply visual classes to the card element itself
      const cardEl = el.classList.contains('tool-card') ? el : el.querySelector('.tool-card') || el;

      if (this.current === PERSONAS.NONE) {
        cardEl.classList.remove('persona-dimmed', 'persona-highlight');
        return;
      }

      if (personas.includes(this.current)) {
        cardEl.classList.add('persona-highlight');
        cardEl.classList.remove('persona-dimmed');
      } else {
        cardEl.classList.add('persona-dimmed');
        cardEl.classList.remove('persona-highlight');
      }
    });
  },

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.persona-option');
      if (trigger) {
        const persona = trigger.getAttribute('data-value');
        this.set(persona);

        // Close preferences menu if active
        document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
      }
    });
  }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => PersonaManager.init());

window.PersonaManager = PersonaManager;
