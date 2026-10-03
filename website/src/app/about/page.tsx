import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Heart, FileText, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About & Transparency | CHAH Foundation",
  description: "We are a small team who simply refused to look away. Learn about our mission and financial transparency.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8">
            We are a small team who simply refused to look away.
          </h1>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-border/50 -mt-24 md:-mt-32 relative z-20">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center">
              <span className="w-8 h-1 bg-secondary mr-4 rounded-full"></span>
              A note from our founders
            </h2>
            <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed">
              <p>
                We started CHAH Foundation after seeing children and elderly people suffering right in front of us.
              </p>
              <p>
                We are not a big organisation. We are a group of people who decided that looking away is no longer an option. When you see a child choosing between medicine and food, you have a moral obligation to act.
              </p>
              <p className="font-bold text-foreground text-xl">
                Every rupee you give goes to real people on the ground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Transparency */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Where Your Money Goes
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                We believe in absolute transparency. When you donate, you have the right to know exactly how your money is being utilized to create impact.
              </p>
              
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-heading text-2xl font-bold mr-6">
                    85%
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">Direct Help</h4>
                    <p className="text-sm text-muted-foreground">Food, medicine, education, and elderly care reaching the beneficiaries directly.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-muted text-foreground flex items-center justify-center font-heading text-2xl font-bold mr-6">
                    10%
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">Field Work & Logistics</h4>
                    <p className="text-sm text-muted-foreground">Transport, volunteer coordination, and on-ground execution costs.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-muted text-foreground flex items-center justify-center font-heading text-2xl font-bold mr-6">
                    5%
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">Operations & Receipts</h4>
                    <p className="text-sm text-muted-foreground">Legal compliance, payment gateway fees, and issuing 80G tax receipts.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Pie Chart (CSS based for simplicity) */}
            <div className="flex justify-center items-center">
              <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-2xl border-4 border-white"
                style={{
                  background: `conic-gradient(
                    var(--primary) 0% 85%, 
                    #94a3b8 85% 95%, 
                    #e2e8f0 95% 100%
                  )`
                }}
              >
                <div className="absolute inset-0 m-auto w-48 h-48 bg-background rounded-full flex flex-col items-center justify-center shadow-inner">
                  <Heart className="w-8 h-8 text-secondary mb-2" fill="currentColor" />
                  <span className="font-bold text-foreground">Maximized</span>
                  <span className="font-bold text-foreground">Impact</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Transparency Promise */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Transparency Promise
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            We publish our reports. You can download them anytime. We have nothing to hide.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto h-14 px-8 rounded-full border-border hover:bg-muted font-bold")}>
              <FileText className="mr-2 h-5 w-5" />
              Download Annual Report 2024
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-secondary text-secondary-foreground text-center">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8">
            Join our small team in making a big difference.
          </h2>
          <Link href="/donate" className={cn(buttonVariants({ size: "lg" }), "h-14 px-12 rounded-full bg-white text-secondary hover:bg-white/90 font-bold text-lg shadow-xl hover:-translate-y-1 transition-all")}>
            Donate Now
          </Link>
        </div>
      </section>

    </div>
  );
}
