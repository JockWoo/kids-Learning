/**
 * Zhuyin Stroke Order Data (全 37 個注音符號教育部標準數字筆順與方向箭頭資料庫)
 * Displays number badges ① ② ③ and directional arrows (↘ ↙ ⤵ → ↓) for preschoolers.
 */

const STROKE_DATA = {
  'ㄅ': {
    symbol: 'ㄅ', word: '包包', icon: '🎒', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 48, y: 16}, arrow: '↙', arrowPos: {x: 36, y: 32}, path: [{x: 48, y: 19}, {x: 28, y: 44}] },
      { num: 2, name: '第二筆：橫折', badgePos: {x: 26, y: 40}, arrow: '⤵', arrowPos: {x: 52, y: 38}, path: [{x: 28, y: 44}, {x: 74, y: 44}, {x: 74, y: 76}, {x: 28, y: 76}] }
    ]
  },
  'ㄆ': {
    symbol: 'ㄆ', word: '蘋果', icon: '🍎', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 48, y: 16}, arrow: '↙', arrowPos: {x: 36, y: 32}, path: [{x: 48, y: 19}, {x: 28, y: 44}] },
      { num: 2, name: '第二筆：橫折', badgePos: {x: 26, y: 40}, arrow: '⤵', arrowPos: {x: 52, y: 38}, path: [{x: 28, y: 44}, {x: 74, y: 44}, {x: 74, y: 68}] },
      { num: 3, name: '第三筆：捺', badgePos: {x: 42, y: 46}, arrow: '↘', arrowPos: {x: 60, y: 64}, path: [{x: 45, y: 48}, {x: 75, y: 78}] }
    ]
  },
  'ㄇ': {
    symbol: 'ㄇ', word: '貓咪', icon: '🐱', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：豎', badgePos: {x: 24, y: 20}, arrow: '↓', arrowPos: {x: 24, y: 48}, path: [{x: 28, y: 24}, {x: 28, y: 76}] },
      { num: 2, name: '第二筆：橫折', badgePos: {x: 32, y: 20}, arrow: '⤵', arrowPos: {x: 52, y: 20}, path: [{x: 28, y: 24}, {x: 74, y: 24}, {x: 74, y: 76}] }
    ]
  },
  'ㄈ': {
    symbol: 'ㄈ', word: '飛機', icon: '✈️', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 24, y: 20}, arrow: '⤵', arrowPos: {x: 52, y: 20}, path: [{x: 28, y: 24}, {x: 74, y: 24}, {x: 74, y: 50}] },
      { num: 2, name: '第二筆：豎折', badgePos: {x: 24, y: 48}, arrow: '↳', arrowPos: {x: 24, y: 64}, path: [{x: 28, y: 50}, {x: 28, y: 76}, {x: 74, y: 76}] }
    ]
  },
  'ㄉ': {
    symbol: 'ㄉ', word: '大象', icon: '🐘', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 48, y: 16}, arrow: '↙', arrowPos: {x: 36, y: 28}, path: [{x: 48, y: 19}, {x: 28, y: 40}] },
      { num: 2, name: '第二筆：橫折彎鉤', badgePos: {x: 26, y: 38}, arrow: '⤵', arrowPos: {x: 52, y: 36}, path: [{x: 28, y: 40}, {x: 74, y: 40}, {x: 74, y: 70}, {x: 40, y: 76}] }
    ]
  },
  'ㄊ': {
    symbol: 'ㄊ', word: '兔子', icon: '🐰', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 68, y: 16}, arrow: '↙', arrowPos: {x: 54, y: 26}, path: [{x: 65, y: 20}, {x: 45, y: 35}] },
      { num: 2, name: '第二筆：橫', badgePos: {x: 20, y: 32}, arrow: '→', arrowPos: {x: 50, y: 32}, path: [{x: 25, y: 35}, {x: 75, y: 35}] },
      { num: 3, name: '第三筆：豎彎鉤', badgePos: {x: 42, y: 32}, arrow: '↳', arrowPos: {x: 42, y: 55}, path: [{x: 45, y: 35}, {x: 45, y: 70}, {x: 70, y: 75}] }
    ]
  },
  'ㄋ': {
    symbol: 'ㄋ', word: '牛奶', icon: '🥛', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 26, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 40, y: 50}] },
      { num: 2, name: '第二筆：彎鉤', badgePos: {x: 36, y: 48}, arrow: '⤵', arrowPos: {x: 56, y: 58}, path: [{x: 40, y: 50}, {x: 70, y: 65}, {x: 50, y: 80}] }
    ]
  },
  'ㄌ': {
    symbol: 'ㄌ', word: '老虎', icon: '🐯', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 26, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 40, y: 50}] },
      { num: 2, name: '第二筆：豎彎鉤', badgePos: {x: 36, y: 48}, arrow: '↳', arrowPos: {x: 36, y: 65}, path: [{x: 40, y: 50}, {x: 40, y: 75}, {x: 70, y: 75}] }
    ]
  },
  'ㄍ': {
    symbol: 'ㄍ', word: '小狗', icon: '🐶', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 26, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 35, y: 50}] },
      { num: 2, name: '第二筆：橫折', badgePos: {x: 26, y: 48}, arrow: '⤵', arrowPos: {x: 50, y: 48}, path: [{x: 30, y: 50}, {x: 70, y: 50}, {x: 35, y: 75}] }
    ]
  },
  'ㄎ': {
    symbol: 'ㄎ', word: '恐龍', icon: '🦖', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 20, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 25, y: 25}, {x: 75, y: 25}] },
      { num: 2, name: '第二筆：豎折撇', badgePos: {x: 46, y: 20}, arrow: '↳', arrowPos: {x: 46, y: 40}, path: [{x: 50, y: 25}, {x: 50, y: 50}, {x: 75, y: 50}, {x: 75, y: 75}] }
    ]
  },
  'ㄏ': {
    symbol: 'ㄏ', word: '火車', icon: '🚂', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 20, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 25, y: 25}, {x: 75, y: 25}] },
      { num: 2, name: '第二筆：撇', badgePos: {x: 32, y: 20}, arrow: '↙', arrowPos: {x: 28, y: 48}, path: [{x: 35, y: 25}, {x: 25, y: 75}] }
    ]
  },
  'ㄐ': {
    symbol: 'ㄐ', word: '小雞', icon: '🐔', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：豎折', badgePos: {x: 30, y: 20}, arrow: '↳', arrowPos: {x: 30, y: 50}, path: [{x: 35, y: 25}, {x: 35, y: 75}, {x: 75, y: 75}] },
      { num: 2, name: '第二筆：撇', badgePos: {x: 68, y: 26}, arrow: '↙', arrowPos: {x: 50, y: 46}, path: [{x: 65, y: 30}, {x: 35, y: 65}] }
    ]
  },
  'ㄑ': {
    symbol: 'ㄑ', word: '氣球', icon: '🎈', strokeCount: 1,
    steps: [
      { num: 1, name: '第一筆：撇折', badgePos: {x: 68, y: 20}, arrow: '↙', arrowPos: {x: 50, y: 36}, path: [{x: 65, y: 25}, {x: 35, y: 50}, {x: 65, y: 75}] }
    ]
  },
  'ㄒ': {
    symbol: 'ㄒ', word: '西瓜', icon: '🍉', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 20, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 25, y: 25}, {x: 75, y: 25}] },
      { num: 2, name: '第二筆：豎', badgePos: {x: 46, y: 20}, arrow: '↓', arrowPos: {x: 46, y: 50}, path: [{x: 50, y: 25}, {x: 50, y: 75}] }
    ]
  },
  'ㄓ': {
    symbol: 'ㄓ', word: '小豬', icon: '🐷', strokeCount: 4,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 26, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 45, y: 45}] },
      { num: 2, name: '第二筆：豎', badgePos: {x: 46, y: 42}, arrow: '↓', arrowPos: {x: 46, y: 60}, path: [{x: 50, y: 45}, {x: 50, y: 75}] },
      { num: 3, name: '第三筆：橫', badgePos: {x: 26, y: 58}, arrow: '→', arrowPos: {x: 40, y: 58}, path: [{x: 30, y: 60}, {x: 50, y: 60}] },
      { num: 4, name: '第四筆：點', badgePos: {x: 62, y: 52}, arrow: '↘', arrowPos: {x: 70, y: 65}, path: [{x: 65, y: 55}, {x: 75, y: 75}] }
    ]
  },
  'ㄔ': {
    symbol: 'ㄔ', word: '草莓', icon: '🍓', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 58, y: 16}, arrow: '↙', arrowPos: {x: 44, y: 28}, path: [{x: 55, y: 20}, {x: 35, y: 40}] },
      { num: 2, name: '第二筆：撇', badgePos: {x: 58, y: 36}, arrow: '↙', arrowPos: {x: 44, y: 50}, path: [{x: 55, y: 40}, {x: 35, y: 65}] },
      { num: 3, name: '第三筆：豎', badgePos: {x: 40, y: 56}, arrow: '↓', arrowPos: {x: 40, y: 72}, path: [{x: 45, y: 60}, {x: 45, y: 85}] }
    ]
  },
  'ㄕ': {
    symbol: 'ㄕ', word: '獅子', icon: '🦁', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 26, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 30, y: 50}] },
      { num: 2, name: '第二筆：豎', badgePos: {x: 46, y: 46}, arrow: '↓', arrowPos: {x: 46, y: 65}, path: [{x: 50, y: 50}, {x: 50, y: 80}] },
      { num: 3, name: '第三筆：點', badgePos: {x: 62, y: 56}, arrow: '↘', arrowPos: {x: 70, y: 68}, path: [{x: 65, y: 60}, {x: 75, y: 75}] }
    ]
  },
  'ㄖ': {
    symbol: 'ㄖ', word: '太陽', icon: '☀️', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：豎', badgePos: {x: 24, y: 20}, arrow: '↓', arrowPos: {x: 24, y: 50}, path: [{x: 30, y: 25}, {x: 30, y: 75}] },
      { num: 2, name: '第二筆：橫折', badgePos: {x: 32, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 70, y: 75}] },
      { num: 3, name: '第三筆：橫', badgePos: {x: 24, y: 46}, arrow: '→', arrowPos: {x: 50, y: 46}, path: [{x: 30, y: 50}, {x: 70, y: 50}] }
    ]
  },
  'ㄗ': {
    symbol: 'ㄗ', word: '腳踏車', icon: '🚲', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 26, y: 20}, arrow: '⤵', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}, {x: 30, y: 50}] },
      { num: 2, name: '第二筆：橫折', badgePos: {x: 26, y: 46}, arrow: '⤵', arrowPos: {x: 50, y: 46}, path: [{x: 30, y: 50}, {x: 70, y: 50}, {x: 50, y: 75}] }
    ]
  },
  'ㄘ': {
    symbol: 'ㄘ', word: '彩虹', icon: '🌈', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 24, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}] },
      { num: 2, name: '第二筆：豎彎', badgePos: {x: 46, y: 20}, arrow: '↳', arrowPos: {x: 46, y: 46}, path: [{x: 50, y: 25}, {x: 50, y: 65}, {x: 75, y: 65}] }
    ]
  },
  'ㄙ': {
    symbol: 'ㄙ', word: '松鼠', icon: '🐿️', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：撇折', badgePos: {x: 46, y: 20}, arrow: '↙', arrowPos: {x: 36, y: 42}, path: [{x: 50, y: 25}, {x: 30, y: 65}, {x: 75, y: 65}] },
      { num: 2, name: '第二筆：點', badgePos: {x: 56, y: 36}, arrow: '↘', arrowPos: {x: 66, y: 48}, path: [{x: 60, y: 40}, {x: 70, y: 55}] }
    ]
  },
  'ㄚ': {
    symbol: 'ㄚ', word: '鴨子', icon: '🦆', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：點', badgePos: {x: 30, y: 20}, arrow: '↘', arrowPos: {x: 40, y: 34}, path: [{x: 35, y: 25}, {x: 45, y: 45}] },
      { num: 2, name: '第二筆：撇豎', badgePos: {x: 68, y: 20}, arrow: '↙', arrowPos: {x: 56, y: 34}, path: [{x: 65, y: 25}, {x: 50, y: 45}, {x: 50, y: 75}] }
    ]
  },
  'ㄛ': {
    symbol: 'ㄛ', word: '青蛙', icon: '🐸', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 24, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}] },
      { num: 2, name: '第二筆：撇', badgePos: {x: 46, y: 20}, arrow: '↙', arrowPos: {x: 36, y: 42}, path: [{x: 50, y: 25}, {x: 30, y: 60}] },
      { num: 3, name: '第三筆：橫折彎', badgePos: {x: 24, y: 56}, arrow: '⤵', arrowPos: {x: 50, y: 56}, path: [{x: 30, y: 60}, {x: 70, y: 60}, {x: 70, y: 80}] }
    ]
  },
  'ㄜ': {
    symbol: 'ㄜ', word: '鵝', icon: '🦢', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 24, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}] },
      { num: 2, name: '第二筆：豎', badgePos: {x: 46, y: 20}, arrow: '↓', arrowPos: {x: 46, y: 40}, path: [{x: 50, y: 25}, {x: 50, y: 55}] },
      { num: 3, name: '第三筆：橫折撇', badgePos: {x: 24, y: 50}, arrow: '⤵', arrowPos: {x: 50, y: 50}, path: [{x: 30, y: 55}, {x: 70, y: 55}, {x: 40, y: 80}] }
    ]
  },
  'ㄝ': {
    symbol: 'ㄝ', word: '椰子', icon: '🥥', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 24, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}] },
      { num: 2, name: '第二筆：豎', badgePos: {x: 36, y: 20}, arrow: '↓', arrowPos: {x: 36, y: 50}, path: [{x: 40, y: 25}, {x: 40, y: 75}] },
      { num: 3, name: '第三筆：豎折', badgePos: {x: 56, y: 20}, arrow: '↳', arrowPos: {x: 56, y: 40}, path: [{x: 60, y: 25}, {x: 60, y: 55}, {x: 75, y: 75}] }
    ]
  },
  'ㄞ': {
    symbol: 'ㄞ', word: '愛心', icon: '💖', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 24, y: 20}, arrow: '→', arrowPos: {x: 50, y: 20}, path: [{x: 30, y: 25}, {x: 70, y: 25}] },
      { num: 2, name: '第二筆：撇', badgePos: {x: 46, y: 20}, arrow: '↙', arrowPos: {x: 38, y: 40}, path: [{x: 50, y: 25}, {x: 35, y: 55}] },
      { num: 3, name: '第三筆：豎彎鉤', badgePos: {x: 30, y: 50}, arrow: '↳', arrowPos: {x: 50, y: 50}, path: [{x: 35, y: 55}, {x: 65, y: 55}, {x: 65, y: 80}] }
    ]
  },
  'ㄟ': {
    symbol: 'ㄟ', word: '杯子', icon: '🥛', strokeCount: 1,
    steps: [
      { num: 1, name: '第一筆：捺', badgePos: {x: 24, y: 24}, arrow: '↘', arrowPos: {x: 50, y: 45}, path: [{x: 30, y: 30}, {x: 50, y: 30}, {x: 75, y: 70}] }
    ]
  },
  'ㄠ': {
    symbol: 'ㄠ', word: '貓頭鷹', icon: '🦉', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：撇折', badgePos: {x: 46, y: 16}, arrow: '↙', arrowPos: {x: 40, y: 30}, path: [{x: 50, y: 20}, {x: 35, y: 40}, {x: 65, y: 40}] },
      { num: 2, name: '第二筆：撇折', badgePos: {x: 60, y: 36}, arrow: '↙', arrowPos: {x: 42, y: 52}, path: [{x: 65, y: 40}, {x: 30, y: 65}, {x: 75, y: 65}] },
      { num: 3, name: '第三筆：點', badgePos: {x: 56, y: 46}, arrow: '↘', arrowPos: {x: 66, y: 62}, path: [{x: 60, y: 50}, {x: 70, y: 75}] }
    ]
  },
  'ㄡ': {
    symbol: 'ㄡ', word: '猴子', icon: '🐵', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫撇', badgePos: {x: 24, y: 24}, arrow: '⤵', arrowPos: {x: 50, y: 24}, path: [{x: 30, y: 30}, {x: 70, y: 30}, {x: 35, y: 70}] },
      { num: 2, name: '第二筆：捺', badgePos: {x: 40, y: 36}, arrow: '↘', arrowPos: {x: 60, y: 56}, path: [{x: 45, y: 40}, {x: 75, y: 75}] }
    ]
  },
  'ㄢ': {
    symbol: 'ㄢ', word: '漢堡', icon: '🍔', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 24, y: 24}, arrow: '⤵', arrowPos: {x: 50, y: 24}, path: [{x: 30, y: 30}, {x: 70, y: 30}, {x: 35, y: 65}] },
      { num: 2, name: '第二筆：豎', badgePos: {x: 46, y: 40}, arrow: '↓', arrowPos: {x: 46, y: 62}, path: [{x: 50, y: 45}, {x: 50, y: 80}] }
    ]
  },
  'ㄣ': {
    symbol: 'ㄣ', word: '人', icon: '🧍', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：橫折', badgePos: {x: 24, y: 24}, arrow: '⤵', arrowPos: {x: 50, y: 24}, path: [{x: 30, y: 30}, {x: 70, y: 30}, {x: 35, y: 55}] },
      { num: 2, name: '第二筆：豎折', badgePos: {x: 30, y: 50}, arrow: '↳', arrowPos: {x: 30, y: 65}, path: [{x: 35, y: 55}, {x: 35, y: 75}, {x: 75, y: 75}] }
    ]
  },
  'ㄤ': {
    symbol: 'ㄤ', word: '羊', icon: '🐑', strokeCount: 3,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 24, y: 24}, arrow: '→', arrowPos: {x: 50, y: 24}, path: [{x: 30, y: 30}, {x: 70, y: 30}] },
      { num: 2, name: '第二筆：撇', badgePos: {x: 46, y: 24}, arrow: '↙', arrowPos: {x: 40, y: 45}, path: [{x: 50, y: 30}, {x: 35, y: 60}] },
      { num: 3, name: '第三筆：豎彎', badgePos: {x: 30, y: 55}, arrow: '↳', arrowPos: {x: 50, y: 55}, path: [{x: 35, y: 60}, {x: 65, y: 60}, {x: 65, y: 80}] }
    ]
  },
  'ㄥ': {
    symbol: 'ㄥ', word: '櫻桃', icon: '🍒', strokeCount: 1,
    steps: [
      { num: 1, name: '第一筆：撇折', badgePos: {x: 68, y: 20}, arrow: '↙', arrowPos: {x: 50, y: 45}, path: [{x: 65, y: 25}, {x: 35, y: 65}, {x: 75, y: 65}] }
    ]
  },
  'ㄦ': {
    symbol: 'ㄦ', word: '耳朵', icon: '👂', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 36, y: 24}, arrow: '↙', arrowPos: {x: 32, y: 50}, path: [{x: 40, y: 30}, {x: 30, y: 75}] },
      { num: 2, name: '第二筆：豎彎鉤', badgePos: {x: 56, y: 24}, arrow: '↳', arrowPos: {x: 56, y: 50}, path: [{x: 60, y: 30}, {x: 60, y: 65}, {x: 75, y: 75}] }
    ]
  },
  'ㄧ': {
    symbol: 'ㄧ', word: '小魚', icon: '🐟', strokeCount: 1,
    steps: [
      { num: 1, name: '第一筆：橫', badgePos: {x: 20, y: 44}, arrow: '→', arrowPos: {x: 50, y: 44}, path: [{x: 25, y: 50}, {x: 75, y: 50}] }
    ]
  },
  'ㄨ': {
    symbol: 'ㄨ', word: '烏龜', icon: '🐢', strokeCount: 2,
    steps: [
      { num: 1, name: '第一筆：撇', badgePos: {x: 68, y: 24}, arrow: '↙', arrowPos: {x: 50, y: 50}, path: [{x: 70, y: 30}, {x: 30, y: 70}] },
      { num: 2, name: '第二筆：捺', badgePos: {x: 24, y: 24}, arrow: '↘', arrowPos: {x: 50, y: 50}, path: [{x: 30, y: 30}, {x: 70, y: 70}] }
    ]
  },
  'ㄩ': {
    symbol: 'ㄩ', word: '白雲', icon: '☁️', strokeCount: 1,
    steps: [
      { num: 1, name: '第一筆：豎折豎', badgePos: {x: 24, y: 24}, arrow: '↳', arrowPos: {x: 24, y: 50}, path: [{x: 30, y: 30}, {x: 30, y: 70}, {x: 70, y: 70}, {x: 70, y: 30}] }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STROKE_DATA };
}
