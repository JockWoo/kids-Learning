/**
 * Little Zhuyin Explorer — ㄅㄆㄇㄈ Dataset
 * Contains Traditional Chinese Bopomofo symbols, words, and icons for preschoolers.
 */

const ZHUYIN_DATA = [
  { symbol: 'ㄅ', word: '包包', icon: '🎒', pinyin: 'b' },
  { symbol: 'ㄆ', word: '蘋果', icon: '🍎', pinyin: 'p' },
  { symbol: 'ㄇ', word: '貓咪', icon: '🐱', pinyin: 'm' },
  { symbol: 'ㄈ', word: '飛機', icon: '✈️', pinyin: 'f' },
  { symbol: 'ㄉ', word: '大象', icon: '🐘', pinyin: 'd' },
  { symbol: 'ㄊ', word: '兔子', icon: '🐰', pinyin: 't' },
  { symbol: 'ㄋ', word: '牛奶', icon: '🥛', pinyin: 'n' },
  { symbol: 'ㄌ', word: '老虎', icon: '🐯', pinyin: 'l' },
  { symbol: 'ㄍ', word: '小狗', icon: '🐶', pinyin: 'g' },
  { symbol: 'ㄎ', word: '恐龍', icon: '🦖', pinyin: 'k' },
  { symbol: 'ㄏ', word: '火車', icon: '🚂', pinyin: 'h' },
  { symbol: 'ㄐ', word: '小雞', icon: '🐔', pinyin: 'j' },
  { symbol: 'ㄑ', word: '氣球', icon: '🎈', pinyin: 'q' },
  { symbol: 'ㄒ', word: '西瓜', icon: '🍉', pinyin: 'x' },
  { symbol: 'ㄓ', word: '小豬', icon: '🐷', pinyin: 'zh' },
  { symbol: 'ㄔ', word: '草莓', icon: '🍓', pinyin: 'ch' },
  { symbol: 'ㄕ', word: '獅子', icon: '🦁', pinyin: 'sh' },
  { symbol: 'ㄖ', word: '太陽', icon: '☀️', pinyin: 'r' },
  { symbol: 'ㄗ', symbolWord: '腳踏車', word: '腳踏車', icon: '🚲', pinyin: 'z' },
  { symbol: 'ㄘ', word: '彩虹', icon: '🌈', pinyin: 'c' },
  { symbol: 'ㄙ', word: '松鼠', icon: '🐿️', pinyin: 's' },
  { symbol: 'ㄚ', word: '鴨子', icon: '🦆', pinyin: 'a' },
  { symbol: 'ㄛ', word: '青蛙', icon: '🐸', pinyin: 'o' },
  { symbol: 'ㄜ', word: '鵝', icon: '🦢', pinyin: 'e' },
  { symbol: 'ㄝ', word: '椰子', icon: '🥥', pinyin: 'eh' },
  { symbol: 'ㄞ', word: '愛心', icon: '💖', pinyin: 'ai' },
  { symbol: 'ㄟ', word: '杯子', icon: '🥛', pinyin: 'ei' },
  { symbol: 'ㄠ', word: '貓頭鷹', icon: '🦉', pinyin: 'ao' },
  { symbol: 'ㄡ', word: '猴子', icon: '🐵', pinyin: 'ou' },
  { symbol: 'ㄢ', word: '漢堡', icon: '🍔', pinyin: 'an' },
  { symbol: 'ㄣ', word: '人', icon: '🧍', pinyin: 'en' },
  { symbol: 'ㄤ', word: '羊', icon: '🐑', pinyin: 'ang' },
  { symbol: 'ㄥ', word: '櫻桃', icon: '🍒', pinyin: 'eng' },
  { symbol: 'ㄦ', word: '耳朵', icon: '👂', pinyin: 'er' },
  { symbol: 'ㄧ', word: '小魚', icon: '🐟', pinyin: 'yi' },
  { symbol: 'ㄨ', word: '烏龜', icon: '🐢', pinyin: 'wu' },
  { symbol: 'ㄩ', word: '白雲', icon: '☁️', pinyin: 'yu' }
];

function getRandomZhuyinItem() {
  const idx = Math.floor(Math.random() * ZHUYIN_DATA.length);
  return ZHUYIN_DATA[idx];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ZHUYIN_DATA, getRandomZhuyinItem };
}
