export default {
  solveStaged(input) {
    const nums = (String(input).match(/-?\d*\.?\d+/g) || []).map(Number)
    const steps = []
    if (/accelerat|speed|velocity|v0|v\b/.test(input) && nums.length >= 2) {
      steps.push('Step 1: Identify knowns — list given values. (Hint: label initial and final velocities and time).')
      steps.push(`Known numbers: ${nums.join(', ')}.`)
      steps.push("Step 2: Choose equation — for constant acceleration use a = (v - v0)/t.")
      steps.push("Step 3: Substitute numbers into the equation and simplify. Would you like me to compute the arithmetic? (Say: compute)")
    } else {
      steps.push("I couldn't confidently parse this numeric problem. Try to write it in the form: 'Given v0 = 0 m/s, v = 20 m/s, t = 4 s, find acceleration'")
    }
    return steps
  },
}