import Link from "next/link";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground pt-16 pb-8 border-t border-border mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-heading font-bold">C</span>
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                CHAH Foundation
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Empowering communities, providing relief, and creating a sustainable future for all. Join our mission today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/campaigns" className="hover:text-primary transition-colors">Our Campaigns</Link></li>
              <li><Link href="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Latest News</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>123 Foundation Street, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@chahfoundation.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} CHAH Foundation. All rights reserved.
          </p>
          <p className="text-sm font-medium text-foreground">
            80G Registered · 100% Transparent · On-ground impact
          </p>
        </div>
      </div>
    </footer>
  );
}
