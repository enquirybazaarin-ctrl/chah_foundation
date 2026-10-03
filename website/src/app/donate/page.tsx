import { Metadata } from "next";
import { DonationForm } from "@/components/donate/DonationForm";

export const metadata: Metadata = {
  title: "Donate Now | CHAH Foundation",
  description: "Make a secure online donation to CHAH Foundation. Your support helps us empower communities and transform futures.",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-muted/30 pt-10 pb-24">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-primary z-0" />
      <div className="absolute top-0 left-0 w-full h-96 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            How much impact do you want to create?
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <DonationForm />
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 max-w-4xl mx-auto text-center grid grid-cols-1 md:grid-cols-3 gap-8 text-foreground/80">
          <div>
            <h3 className="font-bold text-foreground mb-2">Tax Deductible</h3>
            <p className="text-sm">Donations to CHAH Foundation are eligible for tax exemption under section 80G of the Income Tax Act.</p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Secure Payments</h3>
            <p className="text-sm">Your payment information is securely processed via 256-bit encryption by Razorpay.</p>
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">Transparency</h3>
            <p className="text-sm">We ensure that your funds are utilized efficiently for maximum impact on the ground.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
