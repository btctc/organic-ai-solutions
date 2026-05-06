import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Logo from '@/components/Logo';

interface LegalPageProps {
  title: string;
  content: string;
}

export default function LegalPage({ title, content }: LegalPageProps) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-on-surface/10 bg-surface/50 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link href="/" aria-label="Organic AI Solutions home" className="inline-block">
            <Logo width={140} height={44} priority />
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <article className="prose prose-neutral max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="font-display text-4xl md:text-5xl leading-[1.05] mb-6 mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-display text-2xl md:text-3xl mt-12 mb-4 leading-tight">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-display text-xl mt-8 mb-3 leading-tight">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-base leading-relaxed text-on-surface mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-on-surface">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-on-surface">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-tertiary underline hover:no-underline">
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>

          <div className="mt-16 pt-8 border-t border-on-surface/10 text-sm text-on-surface-muted">
            <p>
              Questions? Email <a href="mailto:tc@organicaisolutions.ai" className="text-tertiary hover:underline">tc@organicaisolutions.ai</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
