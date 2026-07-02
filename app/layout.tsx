import { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { PasscodeModal } from '@/components/PasscodeModal'
import { LabProvider } from '@/lib/LabContext'
import PortfolioBar from '@/components/PortfolioBar'


export const metadata: Metadata = {
  title: 'Prompt Lab — Generator · Evaluator · RAG Evaluator',
  description: 'Generate production-grade prompts, evaluate quality, and benchmark RAG pipelines. Powered by Claude & GPT.',
  authors: [{ name: "Atul Sharma", url: "https://atul-sharma-qa.vercel.app" }],
  creator: "Atul Sharma",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Suspense fallback={null}><PortfolioBar /></Suspense>
        <div className="grid-bg" />
        <LabProvider>
          <Nav />
          <div className="relative z-10 flex-1">{children}</div>
          <footer className="relative z-10 border-t border-white/[0.06] py-4 mt-8">
            <p className="text-center text-[#334155] text-xs">
              © {new Date().getFullYear()} Prompt Lab · by Atul Sharma
            </p>
          </footer>
          <PasscodeModal />
        </LabProvider>
      </body>
    </html>
  )
}
