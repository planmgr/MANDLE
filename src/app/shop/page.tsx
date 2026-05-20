export default function ShopPage() {
  return (
      <main className="flex-1 flex flex-col items-center justify-center bg-surface-dark px-5 md:px-8 lg:px-16 py-24 md:py-32">
        <div className="flex flex-col items-center gap-6 md:gap-8 max-w-[500px] text-center">
          <span className="font-caption text-[10px] md:text-[11px] font-medium tracking-[3px] text-accent">
            CURATED COMMERCE
          </span>
          <h1 className="font-heading text-[48px] md:text-[64px] lg:text-[80px] text-fg-inverse leading-[0.95] tracking-[-1px]">
            COMING
            <br />
            SOON.
          </h1>
          <p className="font-body text-[14px] md:text-[15px] text-fg-muted leading-[1.8]">
            룩 기반 큐레이션 커머스가 곧 오픈합니다.
            <br />
            스타일 기반 쇼핑 경험을 가장 먼저 만나보세요.
          </p>

          {/* Email Signup (UI only) */}
          <div className="flex w-full max-w-[400px] mt-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-transparent border border-border-dark text-fg-inverse font-body text-[13px] placeholder:text-fg-tertiary focus:outline-none focus:border-accent"
            />
            <button className="px-6 py-3 bg-fg-inverse text-fg-primary font-caption text-[11px] font-semibold tracking-[1.5px] hover:opacity-90 transition-opacity">
              NOTIFY ME
            </button>
          </div>
        </div>
      </main>
  );
}
