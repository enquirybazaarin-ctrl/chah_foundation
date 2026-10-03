"use client";

import { useState } from "react";
import Script from "next/script";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { createOnlineDonation, verifyOnlineDonation } from "@/lib/api";

const AMOUNTS = [
  { value: 1000, label: "Feeds one child for a full month" },
  { value: 2500, label: "Provides a life-saving medical kit to a family" },
  { value: 5000, label: "Supports one child’s education for a year" },
  { value: 10000, label: "Supports a family for the next 3 months" },
];

export function DonationForm() {
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    panNumber: "",
    isAnonymous: false,
  });

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    if (val) setAmount(Number(val));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const initRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 100) {
      alert("Minimum donation amount is ₹100");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setStatus("idle");

    try {
      // 1. Create order on backend
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        amount,
        is_anonymous: formData.isAnonymous,
        donor: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          pan_number: formData.panNumber.toUpperCase(),
        },
      };

      const donation = await createOnlineDonation(payload, idempotencyKey);
      const razorpayOrderId = donation.payments[0]?.provider_order_id;

      if (!razorpayOrderId) throw new Error("Could not initialize payment order.");

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // paise
        currency: "INR",
        name: "CHAH Foundation",
        description: "Donation",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            // 3. Verify on frontend
            await verifyOnlineDonation({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setStatus("success");
          } catch (err: any) {
            setErrorMessage(err.message || "Payment verification failed.");
            setStatus("error");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#1b4332", // primary color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setErrorMessage(response.error.description || "Payment failed.");
        setStatus("error");
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initialize payment.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12 px-4 bg-white/50 backdrop-blur rounded-3xl border border-border">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Thank You!</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Your generous donation has been received successfully. A receipt will be sent to your email shortly.
        </p>
        <button onClick={() => setStatus("idle")} className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <form onSubmit={initRazorpay} className="bg-white rounded-3xl shadow-xl border border-border overflow-hidden">
        
        {/* Amount Selection */}
        <div className="p-8 border-b border-border/50 bg-muted/20">
          <h2 className="text-xl font-heading font-bold mb-6">1. Select Amount</h2>
          <div className="flex flex-col gap-3 mb-6">
            {AMOUNTS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleAmountClick(item.value)}
                className={`flex items-center justify-between p-4 rounded-xl text-left border-2 transition-all ${
                  amount === item.value && !customAmount
                    ? "border-primary bg-primary/10"
                    : "border-border bg-white hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-lg font-bold ${amount === item.value && !customAmount ? "text-primary" : "text-foreground"}`}>₹{item.value}</span>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${amount === item.value && !customAmount ? "border-primary" : "border-muted-foreground/30"}`}>
                  {amount === item.value && !customAmount && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-lg">₹</span>
            <input
              type="text"
              placeholder="Custom Amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className={`w-full pl-8 pr-4 py-4 rounded-xl border-2 text-lg focus:outline-none transition-colors ${
                customAmount ? "border-primary bg-primary/5" : "border-border bg-white focus:border-primary/50"
              }`}
            />
          </div>
        </div>

        {/* Donor Details */}
        <div className="p-8">
          <h2 className="text-xl font-heading font-bold mb-6">2. Your Details</h2>
          
          {status === "error" && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First Name *</label>
              <input
                required
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address *</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone Number *</label>
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="9876543210"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-foreground">PAN Number (For 80G Tax Exemption)</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase"
              placeholder="ABCDE1234F"
            />
          </div>

          <div className="flex items-center space-x-3 mb-8 p-4 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isAnonymous" className="text-sm text-foreground font-medium">
              Make my donation anonymous (Hide name on public campaigns)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed")}
          >
            {loading ? "Processing..." : `Yes, I want to help`}
          </button>
          
          <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5 flex-wrap">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secure payment · Instant 80G receipt · You can donate anonymously
          </p>
          <p className="text-center text-xs text-muted-foreground/80 mt-2">
            You will receive a confirmation and impact update after your donation reaches them.
          </p>
        </div>
      </form>
    </>
  );
}
