export default {
  classify(text) {
    const t = (text || '').toLowerCase()
    if (/quiz|question bank|take a quiz/.test(t)) return 'quiz'
    if (/[0-9].*\bfind\b|calculate|solve|m\/s|km|\d+\s?=/.test(t)) return 'numeric'
    if (/formula|equation|list.*formulas/.test(t)) return 'formula'
    if (/summary|summarize|chapter summary/.test(t)) return 'summary'
    if (/why|what|define|explain|state|who|when/.test(t)) return 'theory'
    return 'theory'
  },
}