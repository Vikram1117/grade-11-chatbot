import assert from 'assert'
import nlu from '../src/components/nlu.js'

const cases = [
  { in: 'Take a quiz about motion', out: 'quiz' },
  { in: 'Calculate acceleration of a car', out: 'numeric' },
  { in: "Explain Newton's second law", out: 'theory' },
  { in: 'List formulas for kinematics', out: 'formula' },
  { in: 'Give a chapter summary of motion', out: 'summary' },
]

for (const c of cases) {
  const got = nlu.classify(c.in)
  assert.strictEqual(got, c.out, `NLU classify failed for input: "${c.in}" (got: ${got}, want: ${c.out})`)
}

console.log('All NLU tests passed.')