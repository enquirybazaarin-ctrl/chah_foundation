import Image from "next/image";
import Link from "next/link";

export function DonationBannerSection() {
  return (
    <section className="relative w-full overflow-hidden py-0 my-0">
      <Link 
        href="/donate" 
        className="block w-full group overflow-hidden"
        aria-label="Donate now to support our cause - CHAH Foundation"
      >
        <Image
          src="/donationbanner.png"
          alt="Donate now to support our cause - CHAH Foundation 80G Tax Exemption"
          width={1920}
          height={800}
          className="w-full h-auto block group-hover:scale-[1.003] transition-transform duration-500 shadow-sm"
          priority
        />
      </Link>
    </section>
  );
}
