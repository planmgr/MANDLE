import Image from "next/image";

export default function FounderSection() {
  return (
    <section className="bg-surface-dark section-px py-12 md:py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto">
        <span className="font-caption text-[10px] md:text-[11px] font-medium tracking-[3px] text-fg-tertiary">
          THE MAN BEHIND MANDLE
        </span>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 mt-6 md:mt-8">
          {/* Founder Photo */}
          <div className="relative w-full lg:w-[420px] h-[360px] md:h-[480px] lg:h-[520px] shrink-0 overflow-hidden">
            <Image
              src="/images/founder.jpg"
              alt="Junhan Lee — Founder of MANDLE"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          </div>

          {/* Founder Story */}
          <div className="flex flex-col justify-center gap-6 md:gap-8">
            <h2 className="font-heading text-[36px] md:text-[48px] lg:text-[56px] text-fg-inverse leading-[0.95] tracking-[-0.5px]">
              STYLE IS NOT HAIR.
              <br />
              IT&apos;S PRESENCE.
            </h2>

            <div className="flex flex-col gap-4">
              <p className="font-body text-[14px] md:text-[15px] text-fg-muted leading-[1.8] max-w-[520px]">
                IT 업계에서 일하며, 스킨헤드를 선택한 순간부터
                스타일에 대한 시선이 달라졌습니다.
              </p>
              <p className="font-body text-[14px] md:text-[15px] text-fg-muted leading-[1.8] max-w-[520px]">
                머리카락이 아닌, 안경 하나, 수염의 라인, 옷의 핏으로
                존재감을 만드는 법을 배웠습니다.
                MANDLE은 그 경험에서 시작되었습니다.
              </p>
              <p className="font-body text-[14px] md:text-[15px] text-fg-muted leading-[1.8] max-w-[520px]">
                나만의 스타일을 설계하는 남자들.
                단점이 아닌 장점으로 존재감을 찾는 사람들,
                <br/>
                이곳은 그런 사람들을 위한 플랫폼입니다.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-px bg-accent" />
              <div>
                <p className="font-caption text-[12px] font-semibold tracking-[1px] text-fg-inverse">
                  JUNHAN LEE
                </p>
                <p className="font-caption text-[11px] text-fg-tertiary tracking-[0.5px]">
                  Founder & Tech Leader
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
