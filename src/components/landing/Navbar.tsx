"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Services", href: "/#services" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "See It Live", href: "https://templehealthcaredemo.netlify.app", external: true },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      } border-b border-neutral-100`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-18">
        {/* Logo */}
        <Link href="/" style={{ background: "transparent" }} className="shrink-0 flex items-center">
          <Image
            src="/logo.png"
            alt="Organic AI Solutions"
            width={180}
            height={60}
            priority
            style={{ background: "transparent" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="font-[family-name:var(--font-dm-sans)] text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/assessment"
            className="ml-2 px-5 py-2 rounded-lg bg-[#E8420A] text-white text-sm font-semibold font-[family-name:var(--font-montserrat)] hover:bg-[#c93508] transition-colors"
          >
            Free AI Assessment
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden bg-white border-t border-neutral-100"
          >
            <div className="flex flex-col px-6 py-5 gap-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className="text-left font-[family-name:var(--font-dm-sans)] text-neutral-700 font-medium hover:text-neutral-900 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/assessment"
                onClick={() => setMenuOpen(false)}
                className="mt-1 w-full px-5 py-3 rounded-lg bg-[#E8420A] text-white font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:bg-[#c93508] transition-colors"
              >
                Free AI Assessment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
