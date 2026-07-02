import { NextRequest, NextResponse } from 'next/server'
import { callLLM, parseJSON } from '@/lib/llm'
import { buildGeneratorSystemPrompt, buildGeneratorUserPrompt } from '@/lib/prompts'
import type { GenerateRequest } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body: GenerateRequest = await req.json()
  if (!body.useCase?.trim()) return NextResponse.json({ error: 'useCase is required' }, { status: 400 })

  try {
    const raw = await callLLM(body.model, buildGeneratorSystemPrompt(), buildGeneratorUserPrompt(body))
    try {
      return NextResponse.json(parseJSON(raw))
    } catch {
      console.error('JSON parse failed, raw output:', raw.slice(0, 500))
      return NextResponse.json({ error: 'Model returned malformed JSON. Try again or switch models.' }, { status: 500 })
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Generate error:', msg)
    if (msg.includes('API key') || msg.includes('Incorrect API key') || msg.includes('401')) {
      return NextResponse.json({ error: 'API key invalid or missing. Check OPENAI_API_KEY / ANTHROPIC_API_KEY in .env.local.' }, { status: 500 })
    }
    return NextResponse.json({ error: `Generation failed: ${msg.slice(0, 120)}` }, { status: 500 })
  }
}
