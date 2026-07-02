import Link from 'next/link'

const TOOLS = [
  {
    href: '/generator',
    emoji: '⚡',
    title: 'Prompt Generator',
    subtitle: 'From idea → production prompt in 30 seconds',
    desc: 'Describe what you want an AI to do in plain English. The generator builds a complete, structured prompt — a system role, user turn template, and optional few-shot examples.',
    cta: 'Try the Generator',
    color: '#6366F1',
    tags: ['System Prompt', 'User Template', 'Few-shot Examples', 'Chain-of-Thought'],
    steps: [
      'Describe your use-case in the text box (e.g. "a bot that helps users file expense reports")',
      'Pick a model, tone, and task type from the options',
      'Optionally enable Few-shot examples or Chain-of-thought reasoning',
      'Click ⚡ Generate — copy the result straight into your AI app',
    ],
    tip: { color: '#818CF8', border: 'rgba(99,102,241,0.15)', bg: 'rgba(99,102,241,0.06)', text: 'Not sure what to write? Hit one of the "Load Example" buttons at the top of the form — they fill everything in so you can see a result immediately.' },
  },
  {
    href: '/evaluator',
    emoji: '🔬',
    title: 'Prompt Evaluator',
    subtitle: "Find out why your prompt isn't working",
    desc: 'Paste any existing prompt and get scored across 6 quality dimensions — clarity, specificity, role definition, output format, bias risk, and hallucination risk. Includes a ready-to-use improved rewrite.',
    cta: 'Try the Evaluator',
    color: '#A855F7',
    tags: ['6 Quality Dimensions', 'LLM-as-Judge', 'Priority Fixes', 'Improved Rewrite'],
    steps: [
      'Paste the prompt you want to test in the text area (or load one of the quick examples)',
      'Click 🔬 Evaluate — the AI judge analyses it in about 10 seconds',
      'Read the dimension scores to understand what is weak and why',
      'Copy the improved version at the bottom and use it directly',
    ],
    tip: { color: '#C4B5FD', border: 'rgba(168,85,247,0.15)', bg: 'rgba(168,85,247,0.06)', text: 'Start with the "Weak prompt" example to see how a vague prompt scores, then compare against "Strong prompt" to understand the difference a few lines can make.' },
  },
  {
    href: '/rag',
    emoji: '📊',
    title: 'RAG Evaluator',
    subtitle: 'Catch hallucinations before your users do',
    desc: 'Test how well your AI answers questions using retrieved documents. Get RAGAS-style scores — Faithfulness, Answer Relevance, Context Recall, Context Precision — plus explicit hallucination detection.',
    cta: 'Try the RAG Evaluator',
    color: '#06B6D4',
    tags: ['Faithfulness', 'Answer Relevance', 'Context Recall', 'Hallucination Flag'],
    steps: [
      'Paste the user question (e.g. "What is the refund policy?")',
      'Paste the document chunks your system retrieved as context',
      'Paste the AI-generated answer you want to test',
      'Click 📊 Evaluate — see if the answer is grounded in the provided facts',
    ],
    tip: { color: '#67E8F9', border: 'rgba(6,182,212,0.15)', bg: 'rgba(6,182,212,0.06)', text: 'The pre-loaded example has intentional hallucinations — wrong timeframe and wrong email address. Load it to see the detector catch these errors in real time.' },
  },
]

const CONCEPTS = [
  {
    q: 'What is a "prompt"?',
    a: 'A prompt is the instruction you give to an AI model. Think of it like a job description — the more specific and structured it is, the better the AI performs. A strong prompt includes a role ("You are a billing agent"), explicit rules, and an output format.',
  },
  {
    q: 'What is "RAG"?',
    a: 'RAG stands for Retrieval-Augmented Generation. Instead of relying only on what the AI knows, you first search a document library and feed the relevant chunks into the AI along with the question. Think of it as "open-book AI" — it answers based on your documents, not just training data.',
  },
  {
    q: 'What does "LLM-as-Judge" mean?',
    a: 'Instead of writing test cases by hand, we ask another AI model (Claude) to act as the judge and score a prompt or answer. It applies a set of rubrics and gives a score with an explanation — just like a senior human reviewer would.',
  },
  {
    q: 'What does the passcode protect?',
    a: 'Running these tools calls paid AI APIs (Claude, GPT-4). The passcode only blocks the Run/Generate/Evaluate action to prevent accidental cost abuse. You can browse all documentation, examples, and this tutorial freely without any passcode.',
  },
]

export default function Home() {
  return (
    <main className="px-4 py-16 max-w-5xl mx-auto">

      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
          Powered by Claude &amp; GPT-4o
        </div>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-5"
          style={{ background: 'linear-gradient(135deg,#6366F1,#A855F7,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Prompt Lab
        </h1>
        <p className="text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed mb-3">
          A toolkit for anyone building with AI — generate production-ready prompts, score their quality, and catch hallucinations in RAG pipelines.
        </p>
        <p className="text-sm text-[#475569] max-w-xl mx-auto">
          No AI expertise needed to browse. Passcode only required when you hit Run.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link href="/generator" className="btn btn-indigo px-6">⚡ Generate a Prompt</Link>
          <Link href="/guide" className="text-sm px-5 py-2.5 rounded-xl font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}>
            📖 Full Tutorial
          </Link>
        </div>
      </div>

      {/* Tool Cards */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6366F1] mb-2">Three Tools</p>
          <h2 className="text-2xl font-black text-white">Pick the one that fits your problem</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href}
              className="card p-6 flex flex-col group hover:scale-[1.015] transition-all duration-200"
              style={{ borderColor: t.color + '22' }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ background: t.color + '15', border: '1px solid ' + t.color + '30' }}>{t.emoji}</div>
              <h2 className="text-white font-bold text-base mb-1">{t.title}</h2>
              <p className="text-xs font-medium mb-3" style={{ color: t.color }}>{t.subtitle}</p>
              <p className="text-[#7B8FA8] text-sm leading-relaxed flex-1 mb-4">{t.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {t.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: t.color + '10', color: t.color, border: '1px solid ' + t.color + '20' }}>{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: t.color }}>
                {t.cta} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Step-by-step guide */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#A855F7] mb-2">Step-by-Step Guide</p>
          <h2 className="text-2xl font-black text-white">How to use each tool</h2>
          <p className="text-[#64748B] text-sm mt-2">No technical background needed.</p>
        </div>
        <div className="space-y-5">
          {TOOLS.map((t) => (
            <div key={t.href} className="card p-6 lg:p-8" style={{ borderColor: t.color + '20' }}>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: t.color + '15', border: '1px solid ' + t.color + '30' }}>{t.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{t.title}</h3>
                  <p className="text-sm" style={{ color: t.color }}>{t.subtitle}</p>
                </div>
                <Link href={t.href} className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                  style={{ background: t.color + '15', border: '1px solid ' + t.color + '30', color: t.color }}>
                  Open →
                </Link>
              </div>
              <ol className="space-y-3 mb-5">
                {t.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                      style={{ background: t.color + '20', color: t.color }}>{i + 1}</span>
                    <span className="text-[#94A3B8] text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="p-4 rounded-xl text-sm leading-relaxed"
                style={{ background: t.tip.bg, border: '1px solid ' + t.tip.border }}>
                <span className="font-semibold" style={{ color: t.tip.color }}>Tip: </span>
                <span className="text-[#94A3B8]">{t.tip.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concepts */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#06B6D4] mb-2">Key Concepts</p>
          <h2 className="text-2xl font-black text-white">Unfamiliar terms? Plain English below.</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {CONCEPTS.map(({ q, a }) => (
            <div key={q} className="card p-5">
              <p className="text-white font-semibold text-sm mb-2">{q}</p>
              <p className="text-[#7B8FA8] text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Decision Guide */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#F59E0B] mb-2">Not Sure Where to Start?</p>
          <h2 className="text-2xl font-black text-white">Use this quick guide</h2>
        </div>
        <div className="space-y-2">
          {[
            { trigger: 'I need to write a prompt from scratch', tool: '⚡ Prompt Generator', href: '/generator', color: '#6366F1' },
            { trigger: 'I have a prompt but the AI keeps giving poor results', tool: '🔬 Prompt Evaluator', href: '/evaluator', color: '#A855F7' },
            { trigger: 'I want to know exactly how to improve my existing prompt', tool: '🔬 Prompt Evaluator', href: '/evaluator', color: '#A855F7' },
            { trigger: 'I built a document Q&A system and want to check its quality', tool: '📊 RAG Evaluator', href: '/rag', color: '#06B6D4' },
            { trigger: 'I suspect my AI is making up information (hallucinating)', tool: '📊 RAG Evaluator', href: '/rag', color: '#06B6D4' },
            { trigger: 'I want a deeper explanation of how all this works', tool: '📖 Full Tutorial', href: '/guide', color: '#F59E0B' },
          ].map(({ trigger, tool, href, color }) => (
            <Link key={trigger} href={href}
              className="flex items-center gap-4 card p-4 hover:scale-[1.005] transition-all duration-150 group">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <p className="text-[#94A3B8] text-sm flex-1">{trigger}</p>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                style={{ background: color + '15', color, border: '1px solid ' + color + '25' }}>{tool}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <div className="text-center py-12 rounded-2xl"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.07),rgba(168,85,247,0.07))', border: '1px solid rgba(99,102,241,0.15)' }}>
        <p className="text-white font-bold text-lg mb-2">Ready to try it?</p>
        <p className="text-[#64748B] text-sm mb-6">Pick a tool and load an example — you will see results in under 15 seconds.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/generator" className="btn btn-indigo">⚡ Generate a Prompt</Link>
          <Link href="/evaluator" className="text-sm px-4 py-2.5 rounded-xl font-semibold transition-all"
            style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#C4B5FD' }}>
            🔬 Evaluate a Prompt
          </Link>
          <Link href="/rag" className="text-sm px-4 py-2.5 rounded-xl font-semibold transition-all"
            style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#67E8F9' }}>
            📊 Test RAG Quality
          </Link>
        </div>
      </div>
    </main>
  )
}
