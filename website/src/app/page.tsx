import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowRight, Heart, Users, CheckCircle, Target } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { OurImpact } from "@/components/home/OurImpact";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSlider />

      {/* Why Your Support Matters */}
      <section className="py-16 md:py-24 bg-muted/50 border-y border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Your Support Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-6">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">Your money reaches them fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                We send every donation to the ground within 48 hours. No long waiting.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-6">
                <CheckCircle className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">You get full tax benefit</h3>
              <p className="text-muted-foreground leading-relaxed">
                80G certificate is issued instantly. Your donation is fully tax-exempt.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-6">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">You will see the impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                We share real photos and updates of the child or family you helped.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Campaigns Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                These lives need you this week
              </h2>
            </div>
            <Link href="/campaigns" className={cn(buttonVariants({ variant: "ghost" }), "hidden md:flex text-primary hover:text-primary/80 hover:bg-primary/10")}>
              View All Campaigns
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Campaign 1 */}
            <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="h-48 w-full bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors z-10" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  She hasn’t eaten properly in days
                </h3>
                <p className="text-muted-foreground font-medium text-sm mb-6 flex-1 line-clamp-3">
                  ₹1,000 feeds one child for 30 days
                </p>
                <Link href={`/donate?campaign=1`} className={cn(buttonVariants({ variant: "secondary" }), "w-full rounded-xl")}>
                  Feed her now
                </Link>
              </div>
            </div>

            {/* Campaign 2 */}
            <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="h-48 w-full bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors z-10" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  A mother needs medicine for her child
                </h3>
                <p className="text-muted-foreground font-medium text-sm mb-6 flex-1 line-clamp-3">
                  ₹2,500 provides a complete medical kit
                </p>
                <Link href={`/donate?campaign=2`} className={cn(buttonVariants({ variant: "secondary" }), "w-full rounded-xl")}>
                  Send the kit
                </Link>
              </div>
            </div>

            {/* Campaign 3 */}
            <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="h-48 w-full bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors z-10" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  He wants to study but has nothing
                </h3>
                <p className="text-muted-foreground font-medium text-sm mb-6 flex-1 line-clamp-3">
                  ₹5,000 supports education for one full year
                </p>
                <Link href={`/donate?campaign=3`} className={cn(buttonVariants({ variant: "secondary" }), "w-full rounded-xl")}>
                  Give him a chance
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/campaigns" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              View All Campaigns
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <OurImpact />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
        <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-6">
            You already know what the right thing is.
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            One click. One decision. One life changed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/donate" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-full sm:w-auto h-14 px-12 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 transition-all")}>
              Donate Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
