import { NextRequest, NextResponse } from 'next/server'
import { callLLM, parseJSON } from '@/lib/llm'
import { buildEvaluatorSystemPrompt, buildEvaluatorUserPrompt } from '@/lib/prompts'
import type { ModelId } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { prompt, model = 'claude-sonnet-4-6' }: { prompt: string; model?: ModelId } = await req.json()
  if (!prompt?.trim()) return NextResponse.json({ error: 'prompt is required' }, { status: 400 })

  try {
    const raw = await callLLM(model, buildEvaluatorSystemPrompt(), buildEvaluatorUserPrompt(prompt))
    return NextResponse.json(parseJSON(raw))
  } catch (err) {
    console.error('Evaluate error:', err)
    return NextResponse.json({ error: 'Evaluation failed. Check API keys and try again.' }, { status: 500 })
  }
}
