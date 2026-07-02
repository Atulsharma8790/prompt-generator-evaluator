import { NextRequest, NextResponse } from 'next/server'
import { callLLM, parseJSON } from '@/lib/llm'
import { buildRagEvaluatorSystemPrompt, buildRagEvaluatorUserPrompt } from '@/lib/prompts'
import type { ModelId } from '@/lib/types'

export async function POST(req: NextRequest) {
  const { question, context, answer, model = 'claude-sonnet-4-6' }:
    { question: string; context: string; answer: string; model?: ModelId } = await req.json()

  if (!question?.trim() || !context?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: 'question, context, and answer are all required' }, { status: 400 })
  }

  try {
    const raw = await callLLM(model, buildRagEvaluatorSystemPrompt(), buildRagEvaluatorUserPrompt(question, context, answer))
    return NextResponse.json(parseJSON(raw))
  } catch (err) {
    console.error('RAG evaluate error:', err)
    return NextResponse.json({ error: 'RAG evaluation failed. Check API keys and try again.' }, { status: 500 })
  }
}
