/**
 * Little Math Explorer — Visual Theme System
 * Defines theme icons, names, and visual representations for math items.
 */

const THEMES = {
  apple: { id: 'apple', icon: '🍎', name: '蘋果', unit: '個' },
  dog: { id: 'dog', icon: '🐶', name: '小狗', unit: '隻' },
  cat: { id: 'cat', icon: '🐱', name: '貓咪', unit: '隻' },
  car: { id: 'car', icon: '🚗', name: '小汽車', unit: '輛' },
  fish: { id: 'fish', icon: '🐟', name: '小魚', unit: '條' },
  dino: { id: 'dino', icon: '🦖', name: '恐龍', unit: '隻' },
  star: { id: 'star', icon: '⭐', name: '星星', unit: '顆' },
  rocket: { id: 'rocket', icon: '🚀', name: '火箭', unit: '支' },
  cookie: { id: 'cookie', icon: '🍪', name: '餅乾', unit: '塊' }
};

const THEME_KEYS = Object.keys(THEMES);

/**
 * Get a random visual theme object
 */
function getRandomTheme() {
  const randomIndex = Math.floor(Math.random() * THEME_KEYS.length);
  return THEMES[THEME_KEYS[randomIndex]];
}

/**
 * Render visual icons array into an HTML string
 * @param {string} icon - Emoji or icon character
 * @param {number} count - Quantity to render
 * @param {string} extraClass - Optional extra CSS class
 */
function renderVisualIcons(icon, count, extraClass = '') {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<span class="theme-icon-item ${extraClass}">${icon}</span>`;
  }
  return html;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { THEMES, THEME_KEYS, getRandomTheme, renderVisualIcons };
}
