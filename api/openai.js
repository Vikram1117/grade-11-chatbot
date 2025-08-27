import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { prompt, kb } = req.body
    const system = `You are a Grade 11 tutor. Use the provided knowledge base context when answering. Keep explanations stepwise and friendly.`
    const context = Array.isArray(kb?.meta) ? kb.meta.join('\n') : ''

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system + '\nKnowledgeBase:\n' + context },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 700,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    )

    const content = response?.data?.choices?.[0]?.message?.content || ''
    res.status(200).json({ result: content })
  } catch (err) {
    console.error('OpenAI API error:', err?.response?.data || err.message || err)
    res.status(500).json({ error: 'Failed to fetch explanation.' })
  }
}
