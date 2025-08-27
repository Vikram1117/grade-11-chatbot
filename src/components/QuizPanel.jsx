import React, { useState } from 'react'
import sample from '../quiz/sample_quiz.json'

export default function QuizPanel() {
  const [quiz] = useState(sample)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const submit = (choice) => {
    const q = quiz.questions[index]
    const correct = choice === q.answer
    if (correct) setScore((s) => s + 1)

    const hist = JSON.parse(localStorage.getItem('g11:history') || '[]')
    hist.push({ question: q.question, chosen: choice, correct, explanation: q.explanation, time: Date.now() })
    localStorage.setItem('g11:history', JSON.stringify(hist))

    const next = index + 1
    if (next >= quiz.questions.length) setDone(true)
    else setIndex(next)
  }

  const retry = () => {
    setIndex(0)
    setScore(0)
    setDone(false)
  }

  return (
    <div className="border rounded p-3 bg-slate-50">
      <h3 className="font-medium">Quick Quiz</h3>
      {!done ? (
        <div>
          <div className="text-sm mt-2">{quiz.questions[index].question}</div>
          <div className="flex flex-col gap-2 mt-2">
            {quiz.questions[index].options.map((o, i) => (
              <button key={i} onClick={() => submit(i)} className="text-left p-2 bg-white rounded shadow-sm">{o}</button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-sm">Score: {score}/{quiz.questions.length}</div>
          <button onClick={retry} className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded">Retry</button>
        </div>
      )}
    </div>
  )
}