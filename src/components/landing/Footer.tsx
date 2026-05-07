"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Get Started", href: "/#intake" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-5" style={{ background: "transparent" }}>
              <Image
                src="/logo.png"
                alt="Organic AI Solutions"
                width={180}
                height={60}
                style={{ background: "transparent" }}
              />
            </Link>
            <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-neutral-400 text-base leading-snug max-w-xs">
              Grow Organically. Scale Intelligently.
            </p>
            <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm leading-relaxed max-w-xs">
              AI infrastructure for operators. Built right. Deployed fast.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-[family-name:var(--font-montserrat)] text-neutral-400 font-semibold text-xs mb-5 uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-[family-name:var(--font-montserrat)] text-neutral-400 font-semibold text-xs mb-5 uppercase tracking-widest">
              Get Started
            </h4>
            <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm mb-5 leading-relaxed">
              Ready to unlock your business potential with AI?
            </p>
            <Link
              href="/assessment"
              className="px-5 py-2.5 rounded-lg bg-[#E8420A] text-white text-sm font-semibold font-[family-name:var(--font-montserrat)] hover:bg-[#c93508] transition-colors"
            >
              Get Your Free AI Assessment
            </Link>
          </div>
        </div>

        <p className="mb-4 font-[family-name:var(--font-dm-sans)] text-neutral-600 text-xs">
          Industries we serve: Healthcare & Dental · Home Services · Professional Services · Retail & Hospitality · and more
        </p>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-dm-sans)] text-neutral-600 text-sm">
            &copy; 2026 Organic AI Solutions. All rights reserved.
          </p>
          <p className="font-[family-name:var(--font-dm-sans)] text-neutral-700 text-xs">
            Built with purpose. Powered by AI.
          </p>
        </div>
        <p className="text-xs text-white/40">
          Built with Claude. Deployed by OAS.
        </p>
      </div>
    </footer>
  );
}
