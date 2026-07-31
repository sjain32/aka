'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'What services do you provide?',
    answer:
      'I offer end-to-end video editing services — including short-form content (Reels, Shorts, TikToks), long-form YouTube videos, cinematic travel edits, motion graphics, color grading, and sound design. Basically, if it involves video post-production, I handle it.',
  },
  {
    question: 'How do I start working with you?',
    answer:
      'Just hit the "Book a Call" button, share your project details, and we will discuss your vision, timeline, and budget. Once aligned, you upload your footage and I get to work. It is that simple.',
  },
  {
    question: 'What tools do you use?',
    answer:
      'I primarily work with Adobe Premiere Pro, After Effects, DaVinci Resolve, and CapCut. For motion graphics I use a mix of After Effects and custom plugins. I also leverage AI tools for rotoscoping, upscaling, and auto-captioning.',
  },
  {
    question: 'How long does a typical project take?',
    answer:
      'Short-form edits (Reels/Shorts) typically take 24–48 hours. YouTube videos (8–20 min) take 3–5 days. Larger projects like travel films or branded content can take 1–2 weeks depending on complexity. Rush delivery is available.',
  },
  {
    question: 'Do you provide revisions?',
    answer:
      'Absolutely. Every project includes unlimited revision rounds. I provide a review link where you can leave time-stamped feedback, and I iterate until you are 100% happy with the result.',
  },
  {
    question: 'What is your pricing structure?',
    answer:
      'Pricing is project-based and depends on video length, complexity, turnaround time, and additional deliverables (motion graphics, color grading, etc.). I offer competitive rates and package deals for recurring work. Reach out for a custom quote.',
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
  index,
  isVisible,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.16, 0.04, 0.12, 1] }}
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
      className="last:border-b-0 group relative"
    >
      {/* Solid orange background on hover */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-15"
        style={{ background: 'var(--accent)' }}
      />

      {/* Left accent line — slides in via group-hover */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full pointer-events-none scale-y-0 opacity-0 transition-all duration-500 ease-out group-hover:scale-y-100 group-hover:opacity-80"
        style={{ background: 'var(--accent)' }}
      />

      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-4 md:px-6 text-left"
      >
        <span
          className="text-sm md:text-base font-medium pr-4 transition-colors duration-500 ease-out group-hover:text-(--accent)"
          style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 0.04, 0.12, 1] }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
        >
          <span
            className="text-lg leading-none select-none transition-colors duration-500 ease-out group-hover:text-(--accent)"
            style={{ color: 'var(--text-muted)' }}
          >
            +
          </span>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 0.04, 0.12, 1] }}
            className="overflow-hidden"
          >
            <p
              className="text-sm leading-relaxed pb-5 px-4 md:px-6"
              style={{ color: 'var(--text-muted)', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section id="faq" className="glass-section py-24 md:py-32 px-6">
      <div className="max-w-[900px] mx-auto" ref={ref}>
        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span
            className="inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Answers
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold mb-4 tracking-[-0.02em]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div>
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
