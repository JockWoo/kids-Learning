/**
 * Little Alphabet Explorer — English ABC Data Registry
 * 26 Alphabet letters with friendly icons, words, and phonics hints.
 */

const ALPHABET_DATA = [
  { letter: 'A', word: 'Apple', icon: '🍎', hint: 'A is for Apple' },
  { letter: 'B', word: 'Ball', icon: '⚽', hint: 'B is for Ball' },
  { letter: 'C', word: 'Cat', icon: '🐱', hint: 'C is for Cat' },
  { letter: 'D', word: 'Dog', icon: '🐶', hint: 'D is for Dog' },
  { letter: 'E', word: 'Elephant', icon: '🐘', hint: 'E is for Elephant' },
  { letter: 'F', word: 'Fish', icon: '🐟', hint: 'F is for Fish' },
  { letter: 'G', word: 'Giraffe', icon: '🦒', hint: 'G is for Giraffe' },
  { letter: 'H', word: 'House', icon: '🏠', hint: 'H is for House' },
  { letter: 'I', word: 'Ice cream', icon: '🍦', hint: 'I is for Ice cream' },
  { letter: 'J', word: 'Juice', icon: '🧃', hint: 'J is for Juice' },
  { letter: 'K', word: 'Kite', icon: '🪁', hint: 'K is for Kite' },
  { letter: 'L', word: 'Lion', icon: '🦁', hint: 'L is for Lion' },
  { letter: 'M', word: 'Monkey', icon: '🐵', hint: 'M is for Monkey' },
  { letter: 'N', word: 'Nest', icon: '🪹', hint: 'N is for Nest' },
  { letter: 'O', word: 'Owl', icon: '🦉', hint: 'O is for Owl' },
  { letter: 'P', word: 'Panda', icon: '🐼', hint: 'P is for Panda' },
  { letter: 'Q', word: 'Queen', icon: '👑', hint: 'Q is for Queen' },
  { letter: 'R', word: 'Rabbit', icon: '🐰', hint: 'R is for Rabbit' },
  { letter: 'S', word: 'Star', icon: '⭐', hint: 'S is for Star' },
  { letter: 'T', word: 'Tiger', icon: '🐯', hint: 'T is for Tiger' },
  { letter: 'U', word: 'Umbrella', icon: '☂️', hint: 'U is for Umbrella' },
  { letter: 'V', word: 'Violin', icon: '🎻', hint: 'V is for Violin' },
  { letter: 'W', word: 'Watermelon', icon: '🍉', hint: 'W is for Watermelon' },
  { letter: 'X', word: 'Xylophone', icon: '🎼', hint: 'X is for Xylophone' },
  { letter: 'Y', word: 'Yo-yo', icon: '🪀', hint: 'Y is for Yo-yo' },
  { letter: 'Z', word: 'Zebra', icon: '🦓', hint: 'Z is for Zebra' }
];

function getRandomLetterItem() {
  const idx = Math.floor(Math.random() * ALPHABET_DATA.length);
  return ALPHABET_DATA[idx];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ALPHABET_DATA, getRandomLetterItem };
}
