import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { prompt, kb } = req.body

    // System prompt: instruct AI to return structured JSON
    const system = `You are a Grade 11 physics tutor. 
Answer questions in a structured, step-by-step format:
- Provide a title
- Use numbered steps or sections
- Use headings for each concept
- Keep each step concise
- Return the response in JSON format like:
{
  "title": "<topic>",
  "sections": [
    { "heading": "<heading>", "content": "<explanation>" }
  ]
}
Use the provided knowledge base context when answering.`

    const context = Array.isArray(kb?.meta) ? kb.meta.join('\n') : ''

    // Call OpenAI API
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

    const rawContent = response?.data?.choices?.[0]?.message?.content || ''

    // Try parsing JSON, fallback to structured wrapper
    let parsedContent
    try {
      parsedContent = JSON.parse(rawContent)
    } catch {
      parsedContent = {
        title: 'Explanation',
        sections: [{ heading: 'Answer', content: rawContent }],
      }
    }

    res.status(200).json({ result: parsedContent })
  } catch (err) {
    console.error('OpenAI API error:', err?.response?.data || err.message || err)
    res.status(500).json({ error: 'Failed to fetch explanation.' })
  }
}
