"use client";

import React, { useState } from "react";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

type Props = {
  items: FAQItem[];
};

export default function AccordionClient({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  // split into two columns: first 4 items on the left, remaining on the right
  const left = items.slice(0, 4);
  const right = items.slice(4);

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        {left.map((it, idx) => {
          const i = idx; // original index
          return (
            <div key={i} className="border border-gray-2 rounded">
              <button
                type="button"
                aria-expanded={openIndex === i}
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-4 py-3 font-medium text-left"
              >
                <span>{it.question}</span>
                <span className="ml-4 text-lg">{openIndex === i ? "−" : "+"}</span>
              </button>

              <div
                className={`px-4 pb-4 text-sm text-dark-3 transition-all duration-150 ${
                  openIndex === i ? "block pt-0" : "hidden"
                }`}
              >
                {it.answer}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {right.map((it, idx) => {
          const i = 4 + idx; // original index offset
          return (
            <div key={i} className="border border-gray-2 rounded">
              <button
                type="button"
                aria-expanded={openIndex === i}
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-4 py-3 font-medium text-left"
              >
                <span>{it.question}</span>
                <span className="ml-4 text-lg">{openIndex === i ? "−" : "+"}</span>
              </button>

              <div
                className={`px-4 pb-4 text-sm text-dark-3 transition-all duration-150 ${
                  openIndex === i ? "block pt-0" : "hidden"
                }`}
              >
                {it.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
