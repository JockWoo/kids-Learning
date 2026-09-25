/**
 * Little Math Explorer — Question Engine Test Suite
 * Validates 10,000 question iterations for correctness, uniqueness, non-negativity, and choice bounds.
 */

const { QuestionEngine } = require('../js/question-engine.js');
const { THEMES } = require('../js/themes.js');

function runQuestionEngineTests() {
  console.log('🧪 Starting 10,000 Question Generation Tests...');
  const engine = new QuestionEngine({ maxNumber: 10 });
  const modes = ['counting', 'addition', 'subtraction', 'challenge'];
  let totalTested = 0;
  let errors = 0;

  for (let i = 0; i < 10000; i++) {
    const mode = modes[i % modes.length];
    const q = engine.generateQuestion(mode);
    totalTested++;

    // 1. Must return a question object
    if (!q || typeof q.answer !== 'number') {
      console.error(`❌ Test failed at iteration ${i}: Missing valid answer object`, q);
      errors++;
      continue;
    }

    // 2. Choices must contain 3 unique numbers
    if (!Array.isArray(q.choices) || q.choices.length !== 3) {
      console.error(`❌ Test failed at iteration ${i}: Choice count is not 3`, q.choices);
      errors++;
      continue;
    }

    const choiceSet = new Set(q.choices);
    if (choiceSet.size !== 3) {
      console.error(`❌ Test failed at iteration ${i}: Duplicate choices found`, q.choices);
      errors++;
      continue;
    }

    // 3. Correct answer must be in choices
    if (!q.choices.includes(q.answer)) {
      console.error(`❌ Test failed at iteration ${i}: Correct answer ${q.answer} not in choices`, q.choices);
      errors++;
      continue;
    }

    // 4. Mode-specific calculations
    if (q.type === 'addition') {
      const [a, b] = q.operands;
      if (a + b !== q.answer) {
        console.error(`❌ Test failed at iteration ${i}: Addition equation invalid ${a} + ${b} != ${q.answer}`);
        errors++;
      }
      if (q.answer > 10 || q.answer < 0) {
        console.error(`❌ Test failed at iteration ${i}: Addition sum out of range: ${q.answer}`);
        errors++;
      }
    } else if (q.type === 'subtraction') {
      const [total, takeAway] = q.operands;
      if (total - takeAway !== q.answer) {
        console.error(`❌ Test failed at iteration ${i}: Subtraction equation invalid ${total} - ${takeAway} != ${q.answer}`);
        errors++;
      }
      if (q.answer < 0) {
        console.error(`❌ Test failed at iteration ${i}: Subtraction result is negative: ${q.answer}`);
        errors++;
      }
    } else if (q.type === 'counting') {
      if (q.answer < 1 || q.answer > 10) {
        console.error(`❌ Test failed at iteration ${i}: Counting out of range: ${q.answer}`);
        errors++;
      }
    }
  }

  if (errors === 0) {
    console.log(`✅ All ${totalTested} question tests passed cleanly with 0 errors!`);
  } else {
    console.error(`❌ Question engine tests finished with ${errors} errors.`);
    process.exit(1);
  }
}

runQuestionEngineTests();
