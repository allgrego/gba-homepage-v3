import Image from "next/image";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Heading } from "./Heading";

export async function About() {
  const { about: t } = await getDictionary();

  return (
    <section id="nosotros" className="relative scroll-mt-20 sm:scroll-mt-24 overflow-hidden bg-navy text-white">
      <div className="wrap">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
          <div className="pb-10 pt-14 sm:pt-16 lg:py-24 lg:pr-14">
            <Heading
              light={t.titleLight}
              bold={t.titleBold}
              boldClass="text-green"
              className="text-[28px] leading-[1.12] sm:text-[42px]"
            />
            <p className="mt-[26px] text-[17px] font-light leading-[1.7] text-[#e3eaf3]">
              {t.p1Before}
              <strong className="font-bold text-green-light">{t.p1Strong}</strong>
              {t.p1After}
            </p>
            <p className="mt-[18px] text-[17px] font-light leading-[1.7] text-[#e3eaf3]">
              {t.p2Before}
              <em>{t.p2Em}</em>
              {t.p2After}
            </p>
            <p className="mt-[30px] inline-block border-b-2 border-white pb-2.5 text-[19px] font-semibold leading-[1.4]">
              {t.tagline}
            </p>
          </div>
          <div className="about-photo relative min-h-[300px] lg:min-h-[420px]">
            <Image
              src="/images/handshake.jpg"
              alt={t.photoAlt}
              fill
              sizes="(min-width: 1200px) 600px, (min-width: 981px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <Image
        src="/images/mark-white.png"
        alt=""
        width={219}
        height={181}
        className="absolute bottom-6 right-8 w-[52px]"
      />
    </section>
  );
}
