import Image from "next/image";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { contactEmail } from "@/lib/site";
import { MailIcon, PinIcon } from "./icons";

export async function Contact() {
  const { contact: t } = await getDictionary();
  // Suggested message, so the visitor starts from a useful template instead of a blank email.
  const mailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(t.mailBody)}`;

  return (
    <section id="contacto" className="relative scroll-mt-20 sm:scroll-mt-24 overflow-hidden bg-navy text-white">
      <Image
        src="/images/port-ship.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.16]"
      />
      <div className="wrap sec-pad relative">
        <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-lg font-light text-[#d8e1ed]">{t.kicker}</p>
            <h2 className="mt-1.5 inline-block border-b-[3px] border-green pb-3.5 text-[34px] font-bold leading-[1.1] text-green sm:text-[46px]">
              {t.title}
            </h2>
            <p className="mt-7 max-w-[480px] text-[19px] font-light leading-[1.6] text-[#e3eaf3]">
              {t.text}
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a
                href={mailHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary px-7 py-4 text-base"
              >
                {t.mailButton}
              </a>
              <a href="#cotizar-datos" className="btn btn-outline px-7 py-[14.5px] text-base">
                {t.dataButton}
              </a>
            </div>
          </div>
          <ul className="flex flex-col gap-[30px]">
            <li className="flex items-center gap-[18px]">
              <span className="flex size-14 flex-none items-center justify-center rounded-[4px] bg-blue">
                <MailIcon />
              </span>
              <div className="min-w-0">
                <div className="text-[17px] font-bold">{t.emailLabel}</div>
                <a
                  href={mailHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words text-[17px] font-light text-[#e3eaf3]"
                >
                  {contactEmail}
                </a>
              </div>
            </li>
            <li className="flex items-center gap-[18px]">
              <span className="flex size-14 flex-none items-center justify-center rounded-[4px] bg-green">
                <PinIcon />
              </span>
              <div>
                <div className="text-[17px] font-bold">{t.locationLabel}</div>
                <span className="text-[17px] font-light text-[#e3eaf3]">{t.location}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
