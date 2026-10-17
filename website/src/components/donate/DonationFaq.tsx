"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Will I get a receipt for my donation?",
    answer: "Yes, absolutely. As soon as your donation is confirmed, an official receipt and 80G Tax Exemption Certificate are automatically generated and sent directly to your registered email address."
  },
  {
    question: "Is my donation eligible for 80G tax exemption?",
    answer: "Yes, CHAH Foundation is registered under Section 80G of the Income Tax Act (Reg: AACTC9927GF2022801). Indian tax residents are eligible to claim 50% tax exemption on donations."
  },
  {
    question: "How will my donation be used?",
    answer: "Your contribution goes directly towards verified programs including daily nutrition for children, emergency hospital & medical aid, and school kits for underprivileged students."
  },
  {
    question: "Can I donate using UPI, card or net banking?",
    answer: "Yes, we support all major payment modes including Google Pay, PhonePe, Paytm, BHIM UPI, all debit/credit cards (Visa, Mastercard, RuPay), and Netbanking across all Indian banks."
  },
  {
    question: "Can I set up a monthly donation?",
    answer: "Yes! Simply select the 'Monthly' option in the donation form to provide continuous, sustained support for vulnerable children and families."
  }
];

export function DonationFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all overflow-hidden ${
              isOpen
                ? "border-lime-300 bg-white shadow-sm"
                : "border-gray-200/80 bg-white hover:border-gray-300"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFaq(idx)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm sm:text-base focus:outline-none"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-lime-600" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
