import { getDictionary } from "@/app/[lang]/dictionaries";
import { Heading } from "./Heading";
import { ModeTabs } from "./ModeTabs";
import { contactEmail } from "@/lib/site";
import { OpenFormLink } from "./OpenFormLink";

export async function Needs() {
  const { needs: t } = await getDictionary();

  return (
    <section id="cotizar-datos" className="sec-pad scroll-mt-20 sm:scroll-mt-24 bg-white">
      <div className="wrap">
        <div className="max-w-[760px]">
          <Heading
            light={t.titleLight}
            bold={t.titleBold}
            className="text-[28px] leading-[1.12] tracking-[-0.5px] sm:text-[42px]"
          />
          <p className="mt-[18px] text-lg font-light leading-[1.6]">{t.intro}</p>
        </div>

        <h3 className="mb-2 mt-14 text-sm font-bold uppercase tracking-[0.14em] text-navy">
          {t.essentialsTitle}
        </h3>
        <ol className="grid grid-cols-1 gap-x-12 border-t-[3px] border-navy lg:grid-cols-2">
          {t.essentials.map((item, i) => (
            <li key={item.title} className="flex gap-5 border-b border-rule py-6">
              <span aria-hidden="true" className="w-9 flex-none text-[30px] font-bold leading-none text-blue">
                {i + 1}
              </span>
              <div>
                <h4 className="mb-1.5 text-[17px] font-bold text-navy">{item.title}</h4>
                <p className="text-[15px] leading-[1.55]">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mb-2 mt-14 text-sm font-bold uppercase tracking-[0.14em] text-green-text">
          {t.helpfulTitle}
        </h3>
        <ul className="grid grid-cols-1 gap-x-12 border-t-[3px] border-green lg:grid-cols-2">
          {t.helpful.map((item) => (
            <li key={item.title} className="border-b border-rule py-5">
              <h4 className="mb-1.5 text-base font-bold text-navy">{item.title}</h4>
              <p className="text-[15px] leading-[1.55]">{item.text}</p>
            </li>
          ))}
        </ul>

        <ModeTabs t={t.byMode} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-7 rounded-[2px] bg-navy px-6 py-7 text-white sm:px-11 sm:py-9">
          <div className="max-w-[560px]">
            <h3 className="mb-2 text-2xl font-bold">{t.ready.title}</h3>
            <p className="text-base font-light leading-[1.55] text-[#e3eaf3]">{t.ready.text.replace("{email}", contactEmail)}</p>
          </div>
          <OpenFormLink className="btn btn-primary px-7 py-4 text-base">{t.ready.button}</OpenFormLink>
        </div>
      </div>
    </section>
  );
}
