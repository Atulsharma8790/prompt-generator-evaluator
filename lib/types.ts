// ── Model IDs ────────────────────────────────────────────────
export type ClaudeModel = 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001' | 'claude-opus-4-8'
export type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo'
export type ModelId = ClaudeModel | OpenAIModel

export const MODEL_OPTIONS: { value: ModelId; label: string; provider: 'anthropic' | 'openai' }[] = [
  { value: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6',  provider: 'anthropic' },
  { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5',   provider: 'anthropic' },
  { value: 'claude-opus-4-8',           label: 'Claude Opus 4.8',    provider: 'anthropic' },
  { value: 'gpt-4o',                    label: 'GPT-4o',             provider: 'openai' },
  { value: 'gpt-4o-mini',              label: 'GPT-4o Mini',         provider: 'openai' },
  { value: 'gpt-4-turbo',              label: 'GPT-4 Turbo',         provider: 'openai' },
]

export function providerOf(model: ModelId): 'anthropic' | 'openai' {
  return MODEL_OPTIONS.find(m => m.value === model)?.provider ?? 'anthropic'
}

export type Tone = 'professional' | 'conversational' | 'technical' | 'concise' | 'educational'
export type TaskType =
  | 'classification' | 'summarization' | 'extraction' | 'generation'
  | 'qa' | 'reasoning' | 'code' | 'rag' | 'agent' | 'evaluation'

export interface GenerateRequest {
  useCase: string
  model: ModelId
  tone: Tone
  taskType: TaskType
  fewShot: boolean
  chainOfThought: boolean
}

export interface GeneratedPrompt {
  systemPrompt: string
  userTemplate: string
  fewShotExamples?: string
  explanation: string
}

// ── Prompt Evaluator ────────────────────────────────────────
export interface EvalScore {
  dimension: string
  score: number
  rationale: string
  suggestion: string
}

export interface PromptEvalResult {
  overallScore: number
  scores: EvalScore[]
  strengths: string[]
  topFixes: string[]
  improvedPrompt?: string
}

// ── RAG Evaluator ───────────────────────────────────────────
export interface RagEvalScore {
  metric: string
  score: number
  rationale: string
  detail: string
}

export interface RagEvalResult {
  overallScore: number
  scores: RagEvalScore[]
  hallucinationFlag: boolean
  hallucinationDetails: string
  suggestions: string[]
}
