import Link from 'next/link'

export const metadata = {
  title: 'Tutorial & Guide — Prompt Lab',
  description: 'Learn prompt engineering, RAG evaluation, and how to use Prompt Lab from scratch. Plain English tutorial for all skill levels.',
}

export default function GuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="mb-12">
        <Link href="/" className="text-xs text-[#475569] hover:text-[#818CF8] transition-colors mb-4 inline-block">← Back to Home</Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>📖</div>
          <h1 className="text-3xl font-black text-white">Prompt Lab — Full Tutorial</h1>
        </div>
        <p className="text-[#7B8FA8] leading-relaxed">
          Everything you need to know about prompt engineering, RAG evaluation, and how to get the most out of these three tools. No prior AI experience required.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['Beginner Friendly', 'Prompt Engineering', 'RAG Evaluation', 'Hallucination Detection'].map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.2)' }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Table of Contents */}
      <div className="card p-5 mb-10" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FCD34D' }}>Contents</p>
        <ol className="space-y-1.5">
          {[
            ['1', 'What is Prompt Lab?', '#what'],
            ['2', 'Prompt Engineering Basics', '#basics'],
            ['3', 'Using the Prompt Generator', '#generator'],
            ['4', 'Using the Prompt Evaluator', '#evaluator'],
            ['5', 'What is RAG? (Plain English)', '#rag-concept'],
            ['6', 'Using the RAG Evaluator', '#rag-tool'],
            ['7', 'Model Selection Guide', '#models'],
            ['8', 'Tips & Common Mistakes', '#tips'],
          ].map(([n, label, href]) => (
            <li key={href}>
              <a href={href} className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#FCD34D] transition-colors">
                <span className="text-[#475569] font-mono text-xs w-4">{n}.</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-14">

        {/* Section 1 */}
        <section id="what">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">1.</span> What is Prompt Lab?
          </h2>
          <div className="prose-like space-y-3">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Prompt Lab is a set of three AI-powered tools that help you write better instructions for AI systems and verify that those systems are working correctly.
            </p>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              If you have ever typed a question into ChatGPT and felt like the answer was not quite right — Prompt Lab helps you figure out why, and fix it.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              {[
                { e: '⚡', t: 'Prompt Generator', d: 'Write prompts you did not know how to structure', c: '#6366F1', href: '/generator' },
                { e: '🔬', t: 'Prompt Evaluator', d: 'Score and improve prompts you already have', c: '#A855F7', href: '/evaluator' },
                { e: '📊', t: 'RAG Evaluator', d: 'Check if AI answers are faithful to your documents', c: '#06B6D4', href: '/rag' },
              ].map(({ e, t, d, c, href }) => (
                <Link key={href} href={href} className="card p-4 hover:scale-[1.02] transition-all" style={{ borderColor: c + '25' }}>
                  <div className="text-xl mb-2">{e}</div>
                  <p className="text-white font-semibold text-sm mb-1">{t}</p>
                  <p className="text-[#64748B] text-xs leading-relaxed">{d}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="basics">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">2.</span> Prompt Engineering Basics
          </h2>
          <div className="space-y-4">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              A <strong className="text-white">prompt</strong> is the text you send to an AI model to get a response. Most modern AI apps have two parts:
            </p>
            <div className="space-y-3">
              {[
                { name: 'System Prompt', desc: 'The standing instruction that sets the AI\'s role, persona, and rules. Think of it as the job description written by the developer before the user ever types anything. Example: "You are a Tier-1 customer support agent for Acme SaaS. Be empathetic. Never promise refunds without escalation."', color: '#6366F1' },
                { name: 'User Prompt (Turn)', desc: 'The message the user actually sends. A good user turn template tells the AI exactly what format the user\'s input will arrive in. Example: "Customer email: {{email}}. Issue: {{issue}}. Account tier: {{tier}}."', color: '#A855F7' },
              ].map(({ name, desc, color }) => (
                <div key={name} className="card p-4" style={{ borderColor: color + '25' }}>
                  <p className="font-semibold text-white text-sm mb-1" style={{ color }}>{name}</p>
                  <p className="text-[#7B8FA8] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#818CF8' }}>The Golden Rule</p>
              <p className="text-[#94A3B8] text-sm">The more specific you are, the more predictable and reliable the AI will be. Vague instructions produce vague results. That is exactly what the Prompt Evaluator measures.</p>
            </div>

            <h3 className="text-white font-bold mt-6 mb-3">The 6 Dimensions the Evaluator Scores</h3>
            <div className="space-y-2">
              {[
                ['Clarity', 'Is the instruction clear and unambiguous? Could a new employee follow it without guessing?'],
                ['Specificity', 'Does it tell the AI exactly what to do, or is it open to interpretation?'],
                ['Role Definition', 'Does it establish who the AI is and what domain it operates in?'],
                ['Output Format', 'Does it specify the expected format — JSON, bullet points, plain prose, under 100 words, etc.?'],
                ['Bias Risk', 'Does the prompt push the AI toward unfair or one-sided outputs?'],
                ['Hallucination Risk', 'Does the prompt encourage the AI to speculate or make things up when it does not know?'],
              ].map(([name, desc]) => (
                <div key={name} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-[#A855F7] font-semibold text-xs w-36 flex-shrink-0 mt-0.5">{name}</span>
                  <span className="text-[#7B8FA8] text-xs leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="generator">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">3.</span> Using the Prompt Generator
          </h2>
          <div className="space-y-4">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              The Prompt Generator is your starting point if you do not yet have a prompt. Describe what you want in plain English and receive a structured, production-quality prompt.
            </p>
            <h3 className="text-white font-bold text-sm mb-2">Step-by-Step</h3>
            <ol className="space-y-4">
              {[
                { title: 'Write your use-case description', detail: 'In the large text area, describe the AI you want to build. Be as specific as you can. Example: "I need a customer support bot for a SaaS product that handles refund requests. It should ask for the customer\'s order ID and email, resolve billing issues directly, and escalate technical problems to a human agent."' },
                { title: 'Choose a model', detail: 'Claude models (Sonnet, Haiku, Opus) and GPT-4o models are available. For most use-cases, Claude Sonnet 4.6 gives the best balance of speed and quality. GPT-4o is useful when you specifically need OpenAI outputs.' },
                { title: 'Set tone and task type', detail: '"Tone" controls the voice of the output (professional, conversational, technical, etc.). "Task type" helps the generator know what kind of prompt architecture to use — e.g., QA prompts look different from code generation prompts.' },
                { title: 'Enable optional features', detail: '"Few-shot examples" adds 2–3 sample input-output pairs to train the model\'s pattern. "Chain-of-thought" instructs the AI to reason step by step before answering, which improves accuracy on complex tasks.' },
                { title: 'Click Generate and copy', detail: 'You will see three outputs: the System Prompt (paste into the system role), the User Turn Template (paste into the user role, fill in the {{variables}}), and if requested, Few-shot examples. Copy the one you need and paste it into your AI platform.' },
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>{i + 1}</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{s.title}</p>
                    <p className="text-[#7B8FA8] text-sm leading-relaxed">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#818CF8' }}>Pro tip: Generate → Evaluate → Iterate</p>
              <p className="text-[#94A3B8] text-sm">Generate a prompt here, then paste the result into the Prompt Evaluator to get a quality score. If the score is below 8, read the suggestions and either edit manually or re-generate with a more detailed description.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="evaluator">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">4.</span> Using the Prompt Evaluator
          </h2>
          <div className="space-y-4">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              The Prompt Evaluator is for prompts you already have — whether written by you, generated by another tool, or copied from somewhere. It tells you objectively how good the prompt is and exactly what to fix.
            </p>
            <h3 className="text-white font-bold text-sm mb-2">Reading the Results</h3>
            <div className="space-y-2">
              {[
                { range: '8–10', label: 'Production Ready', color: '#22C55E', desc: 'This prompt is strong. Deploy with confidence.' },
                { range: '6–7', label: 'Needs Minor Work', color: '#F59E0B', desc: 'Functionally OK but will benefit from the listed fixes.' },
                { range: '0–5', label: 'Needs Major Revision', color: '#EF4444', desc: 'Likely to produce inconsistent or poor results. Follow the priority fixes before using.' },
              ].map(({ range, label, color, desc }) => (
                <div key={range} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: color + '08', border: '1px solid ' + color + '20' }}>
                  <span className="text-xs font-black px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: color + '20', color }}>{range}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{label}</p>
                    <p className="text-[#7B8FA8] text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mt-2">
              After the scores, you will see <strong className="text-white">Priority Fixes</strong> (ordered by impact) and an <strong className="text-white">Improved Prompt</strong> — an AI-rewritten version of your prompt that addresses all the issues. You can use it directly or as inspiration.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="rag-concept">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">5.</span> What is RAG? (Plain English)
          </h2>
          <div className="space-y-4">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Imagine asking a doctor a question. They could answer from memory (fast, but possibly outdated). Or they could look it up in the patient file first (slower, but accurate). RAG is the second approach — the AI looks up relevant documents before answering.
            </p>
            <div className="card p-5 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#67E8F9' }}>How RAG works, step by step</p>
              {[
                'User asks: "What is the refund policy?"',
                'The system searches a document library and retrieves the relevant policy text',
                'The retrieved text + the question are sent to the AI together',
                'The AI answers using the provided document, not from memory',
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(6,182,212,0.2)', color: '#67E8F9' }}>{i + 1}</span>
                  <span className="text-[#94A3B8] text-sm">{s}</span>
                </div>
              ))}
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              The <strong className="text-white">problem</strong> is that the AI might still drift — give a different refund window than what the document says, or confidently cite a wrong email address. That is called <strong className="text-white">hallucination</strong>, and it is what the RAG Evaluator catches.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="rag-tool">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">6.</span> Using the RAG Evaluator
          </h2>
          <div className="space-y-4">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              The RAG Evaluator requires three inputs — the question, the context (retrieved documents), and the answer. It then scores four RAGAS-style metrics.
            </p>
            <div className="space-y-2">
              {[
                { metric: 'Faithfulness', desc: 'Is every factual claim in the answer directly supported by the provided context? A score of 10 means nothing was invented.' },
                { metric: 'Answer Relevance', desc: 'Does the answer actually address the question? High relevance means the AI did not go off-topic.' },
                { metric: 'Context Recall', desc: 'Did the retrieved document contain all the information needed to answer well? Low recall means your search/retrieval step needs improvement.' },
                { metric: 'Context Precision', desc: 'Is the retrieved context focused and relevant, or is it full of noise? Low precision wastes the AI\'s context window and hurts answer quality.' },
              ].map(({ metric, desc }) => (
                <div key={metric} className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)' }}>
                  <span className="font-semibold text-xs w-40 flex-shrink-0 mt-0.5" style={{ color: '#22D3EE' }}>{metric}</span>
                  <span className="text-[#7B8FA8] text-xs leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-xs font-semibold mb-1 text-red-300">About the Hallucination Flag</p>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                If the answer contains facts that are not in the provided context — even slightly — the evaluator will flag it with an explanation of exactly what was hallucinated. Use the pre-loaded example to see this in action: the AI says &ldquo;14 days&rdquo; when the policy says &ldquo;30 days&rdquo;, and gives the wrong support email.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section id="models">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">7.</span> Model Selection Guide
          </h2>
          <div className="space-y-3">
            {[
              { model: 'Claude Sonnet 4.6', provider: 'Anthropic', use: 'Best default. Fast, smart, and cost-effective. Recommended for 90% of use-cases.', color: '#6366F1' },
              { model: 'Claude Haiku 4.5', provider: 'Anthropic', use: 'Fastest and cheapest. Good for simple tasks or high-volume use-cases where speed matters more than depth.', color: '#6366F1' },
              { model: 'Claude Opus 4.8', provider: 'Anthropic', use: 'Most powerful and thorough. Use for complex reasoning tasks or when you need the absolute best quality.', color: '#6366F1' },
              { model: 'GPT-4o', provider: 'OpenAI', use: 'OpenAI\'s best multi-modal model. Useful when you are building on OpenAI infrastructure or need comparison results.', color: '#10A37F' },
              { model: 'GPT-4o Mini', provider: 'OpenAI', use: 'Fast and cheap OpenAI option. Good for simple tasks when you need OpenAI-specific outputs.', color: '#10A37F' },
              { model: 'GPT-4 Turbo', provider: 'OpenAI', use: 'GPT-4 with a large context window. Useful for processing long documents.', color: '#10A37F' },
            ].map(({ model, provider, use, color }) => (
              <div key={model} className="flex gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex-shrink-0">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: color + '15', color }}>{provider}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{model}</p>
                  <p className="text-[#7B8FA8] text-xs leading-relaxed">{use}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8 */}
        <section id="tips">
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="text-[#F59E0B]">8.</span> Tips & Common Mistakes
          </h2>
          <div className="space-y-3">
            {[
              { type: 'avoid', title: 'Vague role definition', detail: 'Avoid: "You are a helpful assistant." Use: "You are a Tier-1 billing support agent for Acme SaaS, responsible for resolving refund requests and account access issues."' },
              { type: 'avoid', title: 'Missing output format', detail: 'If you do not specify the format, the AI guesses. Always say: "Respond in bullet points", "Reply in under 100 words", or "Output valid JSON with keys: summary, action_items, priority."' },
              { type: 'avoid', title: 'Over-permissive instructions', detail: '"Answer any question the user asks" is dangerous for customer-facing bots. Scope it: "Only answer questions about billing and account access. For all other topics, redirect to the support team."' },
              { type: 'tip', title: 'Iterate with the Generate → Evaluate loop', detail: 'Generate a prompt, evaluate it, read the feedback, re-generate with a better description. Three iterations typically bring any prompt above a score of 8.' },
              { type: 'tip', title: 'Test RAG with your real documents', detail: 'The built-in example is illustrative but synthetic. Paste actual document chunks from your own knowledge base to get meaningful precision and recall scores.' },
              { type: 'tip', title: 'Hallucination detection is not 100%', detail: 'The evaluator is itself an AI — it catches obvious hallucinations reliably but may miss subtle ones. Use it as a quality signal, not a guarantee. Always review high-stakes outputs manually.' },
            ].map(({ type, title, detail }) => (
              <div key={title} className="flex gap-3 p-4 rounded-xl"
                style={{
                  background: type === 'avoid' ? 'rgba(239,68,68,0.05)' : 'rgba(34,197,94,0.05)',
                  border: `1px solid ${type === 'avoid' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
                }}>
                <span className="text-sm flex-shrink-0">{type === 'avoid' ? '⚠' : '✓'}</span>
                <div>
                  <p className="font-semibold text-sm mb-1" style={{ color: type === 'avoid' ? '#FCA5A5' : '#86EFAC' }}>
                    {type === 'avoid' ? 'Avoid: ' : 'Tip: '}{title}
                  </p>
                  <p className="text-[#7B8FA8] text-sm leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-10 rounded-2xl"
          style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.07),rgba(99,102,241,0.07))', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p className="text-white font-bold text-lg mb-2">You are ready to start</p>
          <p className="text-[#64748B] text-sm mb-6">Pick a tool — load an example first if you are unsure.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/generator" className="btn btn-indigo">⚡ Prompt Generator</Link>
            <Link href="/evaluator" className="text-sm px-4 py-2.5 rounded-xl font-semibold transition-all"
              style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#C4B5FD' }}>
              🔬 Prompt Evaluator
            </Link>
            <Link href="/rag" className="text-sm px-4 py-2.5 rounded-xl font-semibold transition-all"
              style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#67E8F9' }}>
              📊 RAG Evaluator
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
