"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import { 
  CalendarCheck, 
  Wallet, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  FileText,
  Sparkles,
  Gift,
  ArrowRight,
  ArrowLeft,
  Check,
  Edit2,
  ShieldCheck
} from "lucide-react";
import { createOnlineDonation, verifyOnlineDonation } from "@/lib/api";
import { ImpactCardGenerator } from "./ImpactCardGenerator";

interface DonationFormProps {
  initialCampaignId?: string;
  initialCampaign?: any;
  campaignsList?: any[];
  selectedAmount?: number | "OTHERS";
  onAmountChange?: (amount: number | "OTHERS") => void;
  initialOccasion?: string;
}

const PRESET_AMOUNTS = [500, 1000, 1500, 2000, 2500, 3000, 5000];

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function DonationForm({ 
  initialCampaignId, 
  initialCampaign,
  campaignsList = [],
  selectedAmount: propSelectedAmount,
  onAmountChange,
  initialOccasion
}: DonationFormProps) {
  // Step State: 1 = Select Amount & Frequency, 2 = Donor Details & Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Frequency: One Time, Monthly, Fullpayment
  const [frequency, setFrequency] = useState<"one-time" | "monthly" | "full">("one-time");

  // Selected Amount
  const [internalAmount, setInternalAmount] = useState<number | "OTHERS">(1000);
  const selectedAmount = propSelectedAmount !== undefined ? propSelectedAmount : internalAmount;
  const [customAmount, setCustomAmount] = useState<string>("");

  // Donor Details state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [panNumber, setPanNumber] = useState("");

  // Celebrate With CHAH Occasion State
  const [occasion, setOccasion] = useState<string>(initialOccasion || "");
  const [dedicationName, setDedicationName] = useState<string>("");
  const [dedicationMessage, setDedicationMessage] = useState<string>("");

  // Campaign
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(initialCampaignId || "");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(initialCampaign || null);

  // Status & Errors
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [successData, setSuccessData] = useState<any>(null);
  const [showCardGenerator, setShowCardGenerator] = useState<boolean>(true);

  // Dev simulation state fallback
  const [devModalOrder, setDevModalOrder] = useState<any>(null);

  // Sync campaign
  useEffect(() => {
    if (selectedCampaignId && campaignsList.length > 0) {
      const match = campaignsList.find(c => String(c.id) === String(selectedCampaignId));
      if (match) setSelectedCampaign(match);
    } else if (!selectedCampaignId) {
      setSelectedCampaign(null);
    }
  }, [selectedCampaignId, campaignsList]);

  // Sync occasion from parent / celebrate section
  useEffect(() => {
    if (initialOccasion) {
      setOccasion(initialOccasion);
    }
  }, [initialOccasion]);

  // Compute final amount
  const finalAmount = selectedAmount === "OTHERS"
    ? (Number(customAmount) || 0)
    : selectedAmount;

  // Handlers for Amount Selection
  const handleAmountClick = (amount: number) => {
    if (onAmountChange) {
      onAmountChange(amount);
    } else {
      setInternalAmount(amount);
    }
    setCustomAmount("");
    setErrorMessage("");
  };

  const handleOthersClick = () => {
    if (onAmountChange) {
      onAmountChange("OTHERS");
    } else {
      setInternalAmount("OTHERS");
    }
    if (!customAmount) setCustomAmount("2000");
    setErrorMessage("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    setErrorMessage("");
  };

  // Step 1 -> Step 2: Validate Amount and Proceed
  const handleProceedToDetails = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!finalAmount || finalAmount < 1) {
      setErrorMessage("Please select or enter a valid donation amount.");
      return;
    }

    setErrorMessage("");
    setCurrentStep(2);

    // Smooth scroll to card top if needed
    const cardEl = document.getElementById("donation-form-card");
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Step 2 -> Step 1: Return to Change Amount
  const handleBackToAmount = () => {
    setErrorMessage("");
    setCurrentStep(1);
  };

  // Step 2: Submit Details & Trigger Razorpay
  const handleFinalPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!finalAmount || finalAmount < 1) {
      setErrorMessage("Please select or enter a valid donation amount.");
      setCurrentStep(1);
      return;
    }

    // Validate details
    if (!fullName.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid Email Address for your 80G Tax Certificate.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit Mobile Number.");
      return;
    }
    if (panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(panNumber.trim())) {
      setErrorMessage("Please enter a valid 10-digit PAN (e.g. ABCDE1234F).");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "Donor";
      const lastName = nameParts.slice(1).join(" ") || "";

      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });

      const occasionText = occasion 
        ? `[Celebrate with CHAH: ${occasion}]${dedicationName ? ` Dedicated to: ${dedicationName}` : ''}${dedicationMessage ? ` | Note: ${dedicationMessage}` : ''}`
        : undefined;

      const payload: any = {
        amount: finalAmount,
        currency: "INR",
        is_anonymous: false,
        donor_message: occasionText,
        donor: {
          first_name: firstName,
          last_name: lastName || undefined,
          email: email.trim(),
          phone: phone.trim() || undefined,
          pan_number: panNumber.trim().toUpperCase() || undefined,
        }
      };

      if (selectedCampaignId) {
        payload.campaign_id = String(selectedCampaignId);
      }

      // 1. Create order on backend
      const donation = await createOnlineDonation(payload, idempotencyKey);
      const razorpayOrderId = donation.payments?.[0]?.provider_order_id;

      if (!razorpayOrderId) {
        throw new Error("Unable to create payment order. Please try again.");
      }

      await loadRazorpayScript();
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Tn01BAA8zDWgpo";
      const isRazorpaySdkAvailable = typeof window !== "undefined" && (window as any).Razorpay;
      const isDevMockKey = razorpayKey === "test_key_id" || razorpayOrderId.startsWith("order_dev_");

      if (isRazorpaySdkAvailable && !isDevMockKey) {
        // Real or Test Razorpay Modal
        const options = {
          key: razorpayKey,
          amount: finalAmount * 100,
          currency: "INR",
          name: "CHAH Foundation",
          description: selectedCampaign ? `Support: ${selectedCampaign.title}` : "80G Tax-Deductible Donation",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              setLoading(true);
              const verified = await verifyOnlineDonation({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              setSuccessData(verified);
              setStatus("success");
            } catch (err: any) {
              setErrorMessage(err.message || "Payment verification failed.");
              setStatus("error");
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: fullName.trim(),
            email: email.trim(),
            contact: phone.trim(),
          },
          theme: {
            color: "#003399",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setErrorMessage(response.error?.description || "Payment was not completed. Please try again.");
          setLoading(false);
        });
        rzp.open();
      } else {
        // Dev Simulation Modal fallback
        setDevModalOrder({
          order_id: razorpayOrderId,
          amount: finalAmount,
          donation
        });
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initialize payment.");
      setLoading(false);
    }
  };

  // Dev simulation complete handler
  const handleDevSimulateSuccess = async () => {
    if (!devModalOrder) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const verified = await verifyOnlineDonation({
        razorpay_order_id: devModalOrder.order_id,
        razorpay_payment_id: `pay_dev_${devModalOrder.order_id}`,
        razorpay_signature: `sig_dev_${Date.now()}`,
      });
      setSuccessData(verified);
      setStatus("success");
      setDevModalOrder(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify simulated payment.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setStatus("idle");
    setSuccessData(null);
    setCurrentStep(1);
    setErrorMessage("");
  };

  const frequencyLabel = 
    frequency === "monthly" ? "Monthly" : 
    frequency === "full" ? "Full Payment" : "One Time";

  // ========================================================
  // SUCCESS SCREEN
  // ========================================================
  if (status === "success" && successData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10 text-center max-w-4xl mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="inline-block px-3 py-1 bg-lime-100 text-lime-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          Donation Successful
        </span>

        <h2 className="text-2xl font-black text-[#003399] tracking-tight mb-2">
          Thank You, {fullName || "Generous Donor"}!
        </h2>

        <p className="text-gray-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Your contribution of <strong className="text-gray-900 font-bold">₹{finalAmount.toLocaleString("en-IN")}</strong> fuels positive change and brings lasting hope to lives and communities.
        </p>

        {/* 80G Certificate Confirmation Card */}
        <div className="bg-lime-50/70 border border-lime-200/80 rounded-xl p-4 mb-6 text-left text-xs space-y-2.5">
          <div className="flex items-start gap-2.5">
            <FileText className="w-4 h-4 text-lime-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-lime-900 text-sm">80G Tax Exemption Receipt Sent</p>
              <p className="text-lime-700 text-xs mt-0.5">
                Your official receipt has been emailed to <strong>{email}</strong> via MSG91.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-lime-200/60 grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-500">Donation No:</span>
              <p className="font-semibold text-gray-800">{successData.donation_number || "CHAH-" + Date.now().toString().slice(-6)}</p>
            </div>
            <div>
              <span className="text-gray-500">Tax Benefit:</span>
              <p className="font-semibold text-gray-800">50% under Sec 80G</p>
            </div>
          </div>
        </div>

        {/* Celebrate with CHAH Occasion Acknowledgment */}
        {occasion && (
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 mb-6 text-left text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#003399]" />
              <span className="font-bold text-[#003399] text-sm">
                Celebrate With CHAH — {occasion}
              </span>
            </div>
            {dedicationName && (
              <p className="text-gray-700">
                Dedicated in honour of: <strong className="text-gray-900 font-semibold">{dedicationName}</strong>
              </p>
            )}
            {dedicationMessage && (
              <p className="text-gray-500 italic text-[11px]">&ldquo;{dedicationMessage}&rdquo;</p>
            )}
          </div>
        )}

        {/* Personalized Digital Impact Recognition Card Generator */}
        <div className="mb-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-[#003399] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-600" />
              <span>Personalized Digital Impact Card</span>
            </span>
            <button
              type="button"
              onClick={() => setShowCardGenerator(!showCardGenerator)}
              className="text-xs font-bold text-[#003399] hover:underline"
            >
              {showCardGenerator ? "Hide Card" : "Show Card"}
            </button>
          </div>

          {showCardGenerator && (
            <div className="animate-fade-in text-left">
              <ImpactCardGenerator
                donorName={fullName || "Generous Supporter"}
                amount={finalAmount}
                occasion={occasion}
                dedicationName={dedicationName}
                dedicationMessage={dedicationMessage}
                donationNumber={successData?.donation_number}
                causeTitle={selectedCampaign?.title || "Child Nutrition & Healthcare"}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#003399] hover:bg-[#002878] text-white font-bold rounded-lg text-sm transition-all shadow-md cursor-pointer"
          >
            Make Another Donation
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // ========================================================
  // MAIN MULTI-STEP DONATION WIDGET
  // ========================================================
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div id="donation-form-card" className="bg-white rounded-2xl shadow-xl border border-gray-200/90 p-4 sm:p-7 max-w-xl mx-auto scroll-mt-28 transition-all">
        
        {/* ======================================================== */}
        {/* STEP PROGRESS WIZARD BAR                                 */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-gray-100">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => currentStep === 2 && handleBackToAmount()}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 text-left transition-opacity ${
              currentStep === 2 ? "cursor-pointer hover:opacity-80" : "cursor-default"
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === 1 
                ? "bg-[#003399] text-white ring-4 ring-blue-50" 
                : "bg-lime-600 text-white"
            }`}>
              {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
            </div>
            <div>
              <p className={`text-xs font-bold leading-tight ${currentStep === 1 ? "text-[#003399]" : "text-gray-800"}`}>
                Step 1
              </p>
              <p className="text-[11px] text-gray-500 font-medium">Select Amount</p>
            </div>
          </button>

          {/* Connecting Divider */}
          <div className={`flex-1 mx-3 sm:mx-4 h-0.5 rounded-full transition-all ${
            currentStep === 2 ? "bg-lime-500" : "bg-gray-200"
          }`} />

          {/* Step 2 Pill */}
          <div className="flex items-center gap-2 text-left">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep === 2 
                ? "bg-[#003399] text-white ring-4 ring-blue-50 shadow-xs" 
                : "bg-gray-100 text-gray-400"
            }`}>
              2
            </div>
            <div>
              <p className={`text-xs font-bold leading-tight ${currentStep === 2 ? "text-[#003399]" : "text-gray-400"}`}>
                Step 2
              </p>
              <p className="text-[11px] text-gray-400 font-medium">Donor Details</p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: AMOUNT & FREQUENCY SELECTION                     */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            {/* Header / Cause Badge */}
            {selectedCampaign && (
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-[#003399] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#003399]" />
                <span className="truncate">Supporting: <strong>{selectedCampaign.title}</strong></span>
              </div>
            )}

            <h3 className="text-lg sm:text-2xl font-bold text-[#003399] text-center tracking-wide uppercase mb-4 sm:mb-5">
              SUPPORT THE CAUSE
            </h3>

            {/* FREQUENCY BUTTONS ROW: One Time, Monthly, Fullpayment */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-5">
              {/* One Time */}
              <button
                type="button"
                onClick={() => setFrequency("one-time")}
                className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg border text-[11px] sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  frequency === "one-time"
                    ? "border-[#003399] bg-[#003399] text-white shadow-xs"
                    : "border-[#003399] text-[#003399] hover:bg-blue-50/50 bg-white"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border text-[9px] sm:text-[10px] font-bold shrink-0 ${
                  frequency === "one-time" ? "border-white text-white" : "border-[#003399] text-[#003399]"
                }`}>
                  1
                </span>
                <span className="truncate">One Time</span>
              </button>

              {/* Monthly */}
              <button
                type="button"
                onClick={() => setFrequency("monthly")}
                className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg border text-[11px] sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  frequency === "monthly"
                    ? "border-[#003399] bg-[#003399] text-white shadow-xs"
                    : "border-[#003399] text-[#003399] hover:bg-blue-50/50 bg-white"
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Monthly</span>
              </button>

              {/* Fullpayment */}
              <button
                type="button"
                onClick={() => setFrequency("full")}
                className={`py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg border text-[11px] sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer ${
                  frequency === "full"
                    ? "border-[#003399] bg-[#003399] text-white shadow-xs"
                    : "border-[#003399] text-[#003399] hover:bg-blue-50/50 bg-white"
                }`}
              >
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Fullpayment</span>
              </button>
            </div>

            {/* AMOUNTS GRID: 4 columns x 2 rows (500, 1000, 1500, 2000, 2500, 3000, 5000, OTHERS) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 mb-5">
              {PRESET_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountClick(amt)}
                    className={`py-2 sm:py-3 px-0.5 sm:px-1 rounded-lg border text-[11px] sm:text-sm md:text-base font-semibold tracking-tight transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#95c718] border-[#95c718] text-white shadow-xs"
                        : "border-[#003399] text-[#003399] hover:bg-blue-50/40 bg-white"
                    }`}
                  >
                    ₹ {amt}
                  </button>
                );
              })}

              {/* OTHERS BUTTON */}
              <button
                type="button"
                onClick={handleOthersClick}
                className={`py-2 sm:py-3 px-0.5 sm:px-1 rounded-lg border text-[10px] sm:text-sm md:text-base font-semibold tracking-tight transition-all cursor-pointer ${
                  selectedAmount === "OTHERS"
                    ? "bg-[#95c718] border-[#95c718] text-white shadow-xs"
                    : "border-[#003399] text-[#003399] hover:bg-blue-50/40 bg-white"
                }`}
              >
                OTHERS
              </button>
            </div>

            {/* CUSTOM AMOUNT INLINE INPUT (When OTHERS is active) */}
            {selectedAmount === "OTHERS" && (
              <div className="mb-5 animate-fade-in text-left">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Enter Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-[#003399]"
                  />
                </div>
              </div>
            )}

            {/* ERROR MESSAGE IF ANY */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* MOTIVATIONAL / IMPACT TEXT */}
            <p className="text-xs sm:text-[13px] font-semibold text-slate-800 tracking-wide leading-relaxed text-left uppercase mb-6">
              SUPPORT OUR CAUSE WITH A DONATION TODAY. EVERY CONTRIBUTION FUELS POSITIVE CHANGE, MAKING A LASTING IMPACT ON LIVES AND COMMUNITIES
            </p>

            {/* PRIMARY ACTION BUTTON: CONTINUE TO STEP 2 */}
            <button
              type="button"
              onClick={handleProceedToDetails}
              className="w-full py-3.5 px-6 bg-[#003399] hover:bg-[#00246a] text-white font-bold rounded-lg text-base transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Continue with ₹{finalAmount > 0 ? finalAmount.toLocaleString("en-IN") : "..."}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Subtle trust footer */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400 text-[11px]">
              <Lock className="w-3 h-3 text-gray-500" />
              <span>256-Bit SSL Secured • 80G Tax Exempt Receipt Issued</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: DONOR INFORMATION FORM                           */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <form onSubmit={handleFinalPaymentSubmit} className="animate-fade-in text-left">
            
            {/* Selected Amount Summary Pill with Edit Action */}
            <div className="mb-5 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-black text-[#003399]">
                    ₹{finalAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-[#003399] text-white rounded-full">
                    {frequencyLabel}
                  </span>
                </div>
                {selectedCampaign ? (
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    For: <strong className="text-gray-800">{selectedCampaign.title}</strong>
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    80G Tax-Deductible Donation
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleBackToAmount}
                className="shrink-0 text-xs font-bold text-[#003399] hover:text-blue-900 bg-white border border-blue-200 hover:border-blue-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                title="Change Amount"
              >
                <Edit2 className="w-3 h-3 text-[#003399]" />
                <span>Change</span>
              </button>
            </div>

            {/* Header: Donor Details */}
            <div className="mb-4">
              <h4 className="text-base sm:text-lg font-bold text-[#003399] tracking-tight">
                Donor Information
              </h4>
              <p className="text-xs text-gray-500">
                Required for issuing your official 80G Tax Exemption receipt.
              </p>
            </div>

            {/* ERROR MESSAGE IF ANY */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3.5 mb-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                />
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">80G receipt will be sent here</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-11 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                    />
                  </div>
                </div>
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  PAN Number <span className="text-gray-400 font-normal">(Optional, for 50% 80G Tax Benefit)</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm uppercase text-gray-900 focus:outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                />
              </div>

              {/* Celebrate With CHAH Occasion Dedication Section */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!occasion}
                    onChange={(e) => setOccasion(e.target.checked ? "Birthday" : "")}
                    className="rounded border-gray-300 text-[#003399] focus:ring-[#003399] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-lime-600" />
                    <span>Dedicate this donation for a special occasion</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-lime-100 text-lime-800">Celebrate</span>
                  </span>
                </label>

                {occasion && (
                  <div className="mt-3 p-3.5 rounded-xl bg-lime-50/60 border border-lime-200/80 space-y-3 animate-fade-in text-left">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Occasion Type
                      </label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white focus:outline-none focus:border-[#003399]"
                      >
                        <option value="Birthday">🎂 Birthday</option>
                        <option value="Anniversary">💍 Anniversary</option>
                        <option value="Festival">🪔 Festival</option>
                        <option value="Personal milestone">🎓 Personal Milestone</option>
                        <option value="In honour or memory">🕊️ In Honour or Memory</option>
                        <option value="Other">✨ Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        In the Name Of / Dedicated To
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. In honor of Rahul / Celebrating Maya's Birthday"
                        value={dedicationName}
                        onChange={(e) => setDedicationName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#003399]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Personal Dedication Note <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Wishing you a year full of joy, blessings and good health!"
                        value={dedicationMessage}
                        onChange={(e) => setDedicationMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#003399]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BUTTONS: BACK & PROCEED TO PAY */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBackToAmount}
                disabled={loading}
                className="w-1/3 py-3.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3.5 px-4 bg-[#003399] hover:bg-[#00246a] disabled:bg-blue-400 text-white font-bold rounded-lg text-sm sm:text-base transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalAmount.toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>
            </div>

            {/* Subtle trust footer */}
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-600" />
              <span>256-Bit SSL Secured • 80G Tax Exempt Receipt Issued</span>
            </div>
          </form>
        )}

      </div>

      {/* DEV SIMULATOR MODAL FALLBACK */}
      {devModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Simulate Payment (Dev Mode)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Order ID: <code className="text-xs bg-gray-100 p-1 rounded">{devModalOrder.order_id}</code>
              <br />
              Amount: <strong>₹{devModalOrder.amount}</strong>
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDevSimulateSuccess}
                disabled={loading}
                className="px-4 py-2 bg-[#003399] hover:bg-[#002878] text-white rounded text-sm font-semibold cursor-pointer"
              >
                {loading ? "Verifying..." : "Simulate Success"}
              </button>
              <button
                onClick={() => setDevModalOrder(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
