import React, { useState, useEffect, useRef } from 'react'
import RuleNLU from './nlu'
import Solver from './solver'
import axios from 'axios'

export default function Chat({ kb }) {
  const [messages, setMessages] = useState(() => {
    const s = localStorage.getItem('g11:chat')
    return s
      ? JSON.parse(s)
      : [
          {
            role: 'bot',
            text: {
              title: 'Welcome',
              sections: [
                {
                  heading: 'Intro',
                  content:
                    "Hi! I'm your Grade 11 Tutor. Ask about theory, solve problems, or take a quiz.",
                },
              ],
            },
          },
        ]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('g11:chat', JSON.stringify(messages))
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')

    const intent = RuleNLU.classify(input)

    if (intent === 'numeric') {
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: {
            title: 'Step-by-step Solution',
            sections: [{ heading: 'Hint', content: 'Let me guide you step-by-step.' }],
          },
        },
      ])
      const steps = Solver.solveStaged(input)
      for (const s of steps) {
        await new Promise((r) => setTimeout(r, 250)) // small delay
        setMessages((m) => [
          ...m,
          { role: 'bot', text: { title: 'Step', sections: [{ heading: 'Step', content: s }] } },
        ])
      }
      return
    }

    setLoading(true)
    try {
      const resp = await axios.post('/api/openai', { prompt: input, kb })
      setMessages((m) => [...m, { role: 'bot', text: resp.data.result }])
    } catch (err) {
      console.error('chat error', err)
      setMessages((m) => [
        ...m,
        {
          role: 'bot',
          text: {
            title: 'Error',
            sections: [{ heading: 'Issue', content: 'Sorry, something went wrong contacting the explanation engine.' }],
          },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3">
      <div className="h-72 overflow-auto p-2 bg-slate-50 rounded">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div
              className={`inline-block p-2 my-1 rounded ${
                m.role === 'user'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-white text-slate-800 shadow-sm'
              }`}
            >
              {m.role === 'bot' && m.text.sections ? (
                <>
                  {m.text.title && <h3 className="font-semibold mb-1">{m.text.title}</h3>}
                  {m.text.sections.map((s, idx) => (
                    <div key={idx} className="mb-1">
                      <strong>{s.heading}:</strong> {s.content}
                    </div>
                  ))}
                </>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          className="flex-1 p-2 border rounded"
          placeholder={
            'Ask: e.g. "Explain Newton\'s second law" or "A car accelerates from 0 to 20 m/s in 4 s, find acceleration"'
          }
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>

      <div className="text-xs text-slate-400">
        Intents: theory | numeric | quiz | summary | formula | faq — rule-based NLU active.
      </div>
    </div>
  )
}