import Image from "next/image";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Logo } from "./Logo";

export async function Footer() {
  const { footer: t } = await getDictionary();

  return (
    <footer className="bg-navy-deep pb-8 pt-14 text-sm text-[#b9c7da]">
      <div className="wrap">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="max-w-[320px]">
            <Logo className="block h-11 w-auto text-green" />
            <p className="mt-[18px] leading-[1.6]">{t.tagline}</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white">{t.servicesTitle}</span>
            {t.services.map((label) => (
              <a key={label} href="#servicios" className="hover:text-white">
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white">{t.pageTitle}</span>
            <a href="#cotizar-datos" className="hover:text-white">{t.pageLinks.needs}</a>
            <a href="#proceso" className="hover:text-white">{t.pageLinks.process}</a>
            <a href="#nosotros" className="hover:text-white">{t.pageLinks.about}</a>
            <a href="#contacto" className="hover:text-white">{t.pageLinks.contact}</a>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#2c4a6e] pt-6">
          <span>{t.legal}</span>
          <Image src="/images/mark-green.png" alt="" width={219} height={181} className="h-[26px] w-auto" />
        </div>
      </div>
    </footer>
  );
}
