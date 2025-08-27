import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { prompt, kb } = req.body

    const system = `You are a Grade 11 physics tutor.
You can:
- Explain concepts in structured JSON (title + sections)
- Generate multiple-choice quizzes

Return JSON always like:
{
  "title": "<topic>",
  "sections": [
    { "heading": "<heading>", "content": "<text or question>" }
  ]
}

Use the knowledge base if helpful.`

    const context = Array.isArray(kb?.meta) ? kb.meta.join('\n') : ''

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system + '\nKnowledgeBase:\n' + context },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 800,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    )

    const rawContent = response?.data?.choices?.[0]?.message?.content || ''

    let parsedContent
    try {
      parsedContent = JSON.parse(rawContent)
    } catch {
      parsedContent = {
        title: 'Response',
        sections: [{ heading: 'Answer', content: rawContent }],
      }
    }

    res.status(200).json({ result: parsedContent })
  } catch (err) {
    console.error('OpenAI API error:', err?.response?.data || err.message || err)
    res.status(500).json({ error: 'Failed to fetch explanation.' })
  }
}
