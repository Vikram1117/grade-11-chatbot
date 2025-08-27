const RuleNLU = {
  classify: (text) => {
    const t = text.toLowerCase()

    // Numeric/math problems
    if (/\d+|solve|calculate|find/i.test(t)) return 'numeric'

    // Quick quiz / practice request
    if (/quick|practice|quiz|short questions|mcq|multiple choice/i.test(t)) return 'quick_quiz'

    // Theory explanations
    if (/explain|define|what is|concept|describe/i.test(t)) return 'theory'

    // Summarize content
    if (/summarize|summary|brief/i.test(t)) return 'summary'

    // Formula request
    if (/formula|equation/i.test(t)) return 'formula'

    // FAQ style
    if (/faq|question/i.test(t)) return 'faq'

    // Default fallback
    return 'theory'
  },
}

export default RuleNLU