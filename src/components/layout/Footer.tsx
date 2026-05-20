import Image from "next/image";

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.51" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-surface-dark">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 section-px py-8 pb-18 md:py-12 md:pb-12">
        <Image
          src="/images/logo-white.png"
          alt="MANDLE"
          width={120}
          height={24}
          className="h-[20px] md:h-[24px] w-auto"
        />
        <p className="font-body text-[10px] md:text-xs text-fg-tertiary order-3 md:order-2">
          &copy; {new Date().getFullYear()} MANDLE. All rights reserved. Style is not hair — it&apos;s
          presence.
        </p>
        <div className="flex items-center gap-6 order-2 md:order-3">
          <a href="#" aria-label="Instagram" className="flex items-center justify-center w-10 h-10 text-fg-tertiary hover:text-fg-inverse transition-colors">
            <IconInstagram />
          </a>
          <a href="#" aria-label="YouTube" className="flex items-center justify-center w-10 h-10 text-fg-tertiary hover:text-fg-inverse transition-colors">
            <IconYoutube />
          </a>
          <a href="#" aria-label="X" className="flex items-center justify-center w-10 h-10 text-fg-tertiary hover:text-fg-inverse transition-colors">
            <IconX />
          </a>
        </div>
      </div>
    </footer>
  );
}
