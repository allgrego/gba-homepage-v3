import { getDictionary } from "@/app/[lang]/dictionaries";
import { Heading } from "./Heading";

const stepStyles = [
  { bg: "bg-navy text-white chev-first lg:pl-8 lg:pr-14", label: "text-green-light", text: "font-light text-[#e3eaf3]" },
  { bg: "bg-navy-tile text-white lg:px-14", label: "text-green-light", text: "font-light text-[#e3eaf3]" },
  { bg: "bg-blue-step text-white lg:px-14", label: "text-[#cff2c9]", text: "font-normal text-white" },
  { bg: "bg-green text-ink lg:px-14", label: "", text: "font-medium" },
];

export async function Process() {
  const { process: t } = await getDictionary();

  return (
    <section id="proceso" className="sec-pad scroll-mt-20 sm:scroll-mt-24">
      <div className="wrap">
        <Heading
          light={t.titleLight}
          bold={t.titleBold}
          className="max-w-[720px] text-[28px] leading-[1.12] tracking-[-0.5px] sm:text-[42px]"
        />
        <ol className="mt-[52px] grid grid-cols-1 gap-0.5 lg:grid-cols-4 lg:gap-0">
          {t.steps.map((step, i) => {
            const s = stepStyles[i];
            return (
              <li key={step.title} className={`chev px-5 py-7 sm:p-7 lg:py-[34px] ${s.bg}`}>
                <span className={`text-sm font-bold uppercase tracking-[0.14em] ${s.label}`}>
                  {t.stepLabel} {i + 1}
                </span>
                <h3 className="my-2.5 text-[19px] font-bold">{step.title}</h3>
                <p className={`text-[14.5px] leading-[1.6] ${s.text}`}>{step.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
