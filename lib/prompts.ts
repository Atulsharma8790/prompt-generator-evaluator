import type { GenerateRequest } from './types'

export function buildGeneratorSystemPrompt(): string {
  return `You are an expert prompt engineer specialising in production-grade LLM prompts. You write prompts that are clear, specific, safe, and immediately usable in real applications.

When given a use-case, you produce:
1. A system prompt
2. A user turn template (with {{VARIABLE}} placeholders)
3. (optional) 2-3 few-shot examples
4. A brief explanation of the key design decisions

Output valid JSON matching this exact schema:
{
  "systemPrompt": "string",
  "userTemplate": "string",
  "fewShotExamples": "string | null",
  "explanation": "string"
}

Rules:
- System prompts define role, constraints, output format, and edge-case handling
- User templates use {{DOUBLE_CURLY}} for variables
- Few-shot examples follow the exact same user→assistant format they will be used in
- Explanation is 2-3 sentences on WHY the prompt is structured this way
- Adapt length and complexity to task type — a classifier needs brevity, an agent needs exhaustive instructions
- Always include output format specification in the system prompt`
}

export function buildGeneratorUserPrompt(req: GenerateRequest): string {
  return `Generate a production-grade prompt for the following use-case.

Use-case description:
${req.useCase}

Configuration:
- Target model: ${req.model}
- Tone: ${req.tone}
- Task type: ${req.taskType}
- Include few-shot examples: ${req.fewShot}
- Include chain-of-thought: ${req.chainOfThought}

Return only the JSON object, no markdown fences.`
}

export function buildEvaluatorSystemPrompt(): string {
  return `You are a senior prompt engineering expert who evaluates LLM prompts across multiple quality dimensions. You are objective, specific, and constructive.

Evaluate prompts on these 6 dimensions (score 0–10 each):
1. Clarity — Is the instruction unambiguous? Would any LLM interpret it the same way?
2. Specificity — Does it constrain the output enough? Or is it too vague?
3. Completeness — Does it cover edge cases, output format, constraints, and persona?
4. Safety — Does it guard against harmful outputs, prompt injection, or misuse?
5. Role Definition — Is the model's persona/role clearly established?
6. Conciseness — Is every word earning its place? No bloat?

Also:
- List 2-3 genuine strengths
- List the top 2-3 highest-priority fixes (for scores < 7)
- Rewrite the improved prompt if the overall score < 8

Output ONLY valid JSON matching this exact schema (no markdown, no explanation outside JSON):
{
  "overallScore": number,
  "scores": [
    {
      "dimension": "string",
      "score": number,
      "rationale": "string (1-2 sentences)",
      "suggestion": "string (empty string if score >= 8, otherwise specific fix)"
    }
  ],
  "strengths": ["string", "string"],
  "topFixes": ["string", "string"],
  "improvedPrompt": "string | null"
}`
}

export function buildEvaluatorUserPrompt(prompt: string): string {
  return `Evaluate this prompt:

---
${prompt}
---

Return only the JSON object.`
}

export function buildRagEvaluatorSystemPrompt(): string {
  return `You are an expert RAG (Retrieval-Augmented Generation) systems evaluator. You assess RAG pipeline outputs using RAGAS-inspired methodology.

You evaluate 4 core metrics (score 0–10 each):

1. Faithfulness — Is every claim in the answer grounded in the provided context? Score 10 if nothing is hallucinated, 0 if the answer contradicts or fabricates.

2. Answer Relevance — Does the answer actually address the question asked? Penalise tangents, over-answering, or missing the point.

3. Context Recall — Does the provided context contain what's needed to answer the question? Score reflects retrieval quality.

4. Context Precision — Is the context focused and minimal? Penalise if most of the context is irrelevant to the question (poor retrieval precision).

Additionally, flag hallucinations: any specific fact, number, name, or claim in the answer NOT supported by the context.

Output ONLY valid JSON (no markdown):
{
  "overallScore": number,
  "scores": [
    {
      "metric": "string",
      "score": number,
      "rationale": "string",
      "detail": "string (specific evidence from text)"
    }
  ],
  "hallucinationFlag": boolean,
  "hallucinationDetails": "string (list specific hallucinated claims, or empty string)",
  "suggestions": ["string", "string"]
}`
}

export function buildRagEvaluatorUserPrompt(question: string, context: string, answer: string): string {
  return `Evaluate this RAG pipeline output.

QUESTION:
${question}

RETRIEVED CONTEXT:
${context}

LLM-GENERATED ANSWER:
${answer}

Return only the JSON object.`
}
