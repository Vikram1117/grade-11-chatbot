import React from 'react'
import Chat from './components/Chat'
import QuizPanel from './components/QuizPanel'
import ProgressPanel from './components/ProgressPanel'
import KB from './kb/kb.json'

export default function App() {
  return (
    <div className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Grade 11 Tutor Chatbot</h1>
          <p className="text-sm text-slate-500">Subjects: Physics · Chemistry · Economics</p>

          <Chat kb={KB} />

          <div className="text-xs text-slate-400 mt-2">KB sources: CK-12 FlexBooks (Physics, Chemistry) + EPISD Economics (CK-12). See README for details.</div>
        </div>

        <aside className="md:col-span-1 flex flex-col gap-4">
          <QuizPanel kb={KB} />
          <ProgressPanel />
        </aside>
      </div>
    </div>
  )
}