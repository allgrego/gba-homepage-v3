import Image from "next/image";
import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { Heading } from "./Heading";
import { isQuoteFormEnabled } from "@/lib/server/flags";
import { QuoteCard } from "./QuoteCard";

export async function Hero() {
  const [t, lang] = await Promise.all([getDictionary(), getLocale()]);
  const { hero } = t;

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="hero-photo absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <Image
          src="/images/hero-containers.jpg"
          alt=""
          fill
          priority
          sizes="52vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(32,61,96,0.92),rgba(32,61,96,0.5))]" />
      </div>

      <div className="wrap relative py-14 sm:py-[72px] lg:py-14">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div>
            <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.18em] text-green-light">
              {hero.eyebrow}
            </p>
            <Heading
              as="h1"
              light={hero.titleLight}
              bold={hero.titleBold}
              boldClass="text-green"
              className="text-[34px] leading-[1.06] tracking-[-1px] sm:text-[44px] xl:text-[56px]"
            />
            <p className="mt-7 max-w-[540px] text-lg font-light leading-[1.65] text-[#e3eaf3]">
              {hero.text}
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <a href="#cotizar" className="btn btn-primary px-7 py-4 text-base">
                {hero.primary}
              </a>
              <a href="#cotizar-datos" className="btn btn-outline px-7 py-[14.5px] text-base">
                {hero.secondary}
              </a>
            </div>
            <p className="mt-11 inline-block border-t border-[#4a6a92] pt-[18px] text-lg font-light italic text-[#d8e1ed]">
              {hero.tagline}
            </p>
          </div>

          <QuoteCard t={t.quote} lang={lang} disabled={!isQuoteFormEnabled()} />
        </div>
      </div>
    </section>
  );
}
