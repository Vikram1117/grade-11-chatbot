import React, { useEffect, useState } from 'react'

export default function ProgressPanel() {
  const [history, setHistory] = useState([])
  useEffect(() => { setHistory(JSON.parse(localStorage.getItem('g11:history') || '[]')) }, [])

  const mastery = () => {
    if (history.length === 0) return 'No quizzes yet'
    const correct = history.filter((h) => h.correct).length
    return `${Math.round((correct / history.length) * 100)}%`
  }

  return (
    <div className="border rounded p-3 bg-white">
      <h4 className="font-medium">Progress</h4>
      <div className="text-sm mt-2">Topic mastery (approx): {mastery()}</div>
      <div className="text-xs text-slate-400 mt-2">History (latest 5)</div>
      <ul className="text-xs mt-2 list-disc list-inside">
        {history.slice(-5).reverse().map((h, i) => (<li key={i}>{h.question} — {h.correct ? '✓' : '✗'}</li>))}
      </ul>
    </div>
  )
}