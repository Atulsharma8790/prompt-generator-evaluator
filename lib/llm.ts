import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { providerOf, type ModelId } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openai    = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function callLLM(model: ModelId, system: string, user: string): Promise<string> {
  const provider = providerOf(model)

  if (provider === 'openai') {
    const res = await openai.chat.completions.create({
      model,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: user },
      ],
    })
    return res.choices[0]?.message?.content ?? ''
  }

  // Anthropic
  const res = await anthropic.messages.create({
    model: model as string,
    max_tokens: 2048,
    system,
    messages: [{ role: 'user', content: user }],
  })
  return res.content[0]?.type === 'text' ? res.content[0].text : ''
}

export function parseJSON(raw: string): unknown {
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(cleaned)
}
