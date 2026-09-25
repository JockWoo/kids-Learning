/**
 * Little Math Explorer — English Edition Visual Themes
 */

const THEMES = {
  apple: { id: 'apple', icon: '🍎', name: 'apples', singular: 'apple' },
  dog: { id: 'dog', icon: '🐶', name: 'dogs', singular: 'dog' },
  cat: { id: 'cat', icon: '🐱', name: 'cats', singular: 'cat' },
  car: { id: 'car', icon: '🚗', name: 'cars', singular: 'car' },
  fish: { id: 'fish', icon: '🐟', name: 'fish', singular: 'fish' },
  dino: { id: 'dino', icon: '🦖', name: 'dinosaurs', singular: 'dinosaur' },
  star: { id: 'star', icon: '⭐', name: 'stars', singular: 'star' },
  rocket: { id: 'rocket', icon: '🚀', name: 'rockets', singular: 'rocket' },
  cookie: { id: 'cookie', icon: '🍪', name: 'cookies', singular: 'cookie' }
};

const THEME_KEYS = Object.keys(THEMES);

function getRandomTheme() {
  const randomIndex = Math.floor(Math.random() * THEME_KEYS.length);
  return THEMES[THEME_KEYS[randomIndex]];
}

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
