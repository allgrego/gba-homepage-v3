import Image from "next/image";
import { getDictionary } from "@/app/[lang]/dictionaries";
import { Heading } from "./Heading";
import { BulbIcon, ClipboardIcon, ShieldIcon, tileIcons, type TileIconId } from "./icons";

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="mt-3.5 text-[15px] font-semibold text-navy">
      {items.map((item) => (
        <li key={item} className="border-t border-rule-soft py-[9px]">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ServiceCard({
  tone,
  icon,
  title,
  children,
}: {
  tone: "green" | "blue";
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const border = tone === "green" ? "border-green" : "border-blue";
  const fill = tone === "green" ? "bg-green" : "bg-blue";
  return (
    <div className={`border-t-[5px] bg-white px-8 pb-10 pt-9 ${border}`}>
      <span className={`flex size-[52px] items-center justify-center rounded-[4px] ${fill}`}>{icon}</span>
      <h3 className="mt-[22px] text-[22px] font-bold leading-[1.2] text-navy">{title}</h3>
      {children}
    </div>
  );
}

export async function Services() {
  const { services: t } = await getDictionary();
  const { logistics } = t;

  return (
    <section id="servicios" className="sec-pad scroll-mt-20 sm:scroll-mt-24">
      <div className="wrap">
        <div className="max-w-[720px]">
          <Heading
            light={t.titleLight}
            bold={t.titleBold}
            className="text-[28px] leading-[1.12] tracking-[-0.5px] sm:text-[42px]"
          />
          <p className="mt-[18px] text-lg font-light leading-[1.6]">{t.intro}</p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[2px] bg-navy text-white">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="px-6 pb-6 pt-8 sm:px-12 sm:pb-10 sm:pt-12">
              <h3 className="text-[34px] font-bold leading-[1.15]">
                <span className="text-green">{logistics.titleAccent}</span> {logistics.titleRest}
              </h3>
              <p className="mt-5 text-[16.5px] font-light leading-[1.7] text-[#e3eaf3]">
                {logistics.text}
              </p>
            </div>
            <div className="log-photo relative hidden min-h-[260px] lg:block">
              <Image
                src="/images/port-ship.jpg"
                alt={logistics.photoAlt}
                fill
                sizes="(min-width: 1200px) 520px, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(32,61,96,0.25)]" />
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-12 sm:pb-12">
            <p className="mb-[18px] text-sm font-bold uppercase tracking-[0.12em] text-green-light">
              {logistics.kicker}
            </p>
            <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
              {logistics.tiles.map((tile) => {
                const TileIcon = tileIcons[tile.id as TileIconId];
                return (
                  <li
                    key={tile.id}
                    className="min-h-[150px] bg-navy-tile px-6 py-[26px] transition-colors hover:bg-navy-tile-hover"
                  >
                    <TileIcon />
                    <h4 className="mb-1.5 mt-4 text-[17px] font-bold">{tile.title}</h4>
                    <p className="text-sm font-light leading-[1.55] text-[#e3eaf3]">{tile.text}</p>
                  </li>
                );
              })}
              <li className="flex">
                <a
                  href="#cotizar"
                  className="btn btn-primary flex min-h-[150px] w-full flex-col justify-between gap-4 rounded-none px-6 py-[26px] text-left"
                >
                  <span className="text-[17px] font-bold leading-[1.35]">{logistics.ctaText}</span>
                  <span className="text-[15px] font-bold">{logistics.ctaLink}</span>
                </a>
              </li>
            </ul>
          </div>

          <Image
            src="/images/mark-white.png"
            alt=""
            width={219}
            height={181}
            className="absolute right-5 top-5 w-11 opacity-85"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ServiceCard tone="green" icon={<ShieldIcon />} title={t.insurance.title}>
            <p className="mt-3.5 text-[15px] font-bold text-green-text">{t.insurance.tagline}</p>
            <p className="mt-2.5 text-[15px] leading-[1.65]">{t.insurance.text}</p>
          </ServiceCard>
          <ServiceCard tone="blue" icon={<ClipboardIcon />} title={t.customs.title}>
            <p className="mt-3.5 text-[15px] leading-[1.65]">{t.customs.text}</p>
            <ListItems items={t.customs.items} />
          </ServiceCard>
          <ServiceCard tone="green" icon={<BulbIcon />} title={t.advisory.title}>
            <p className="mt-3.5 text-[15px] leading-[1.65]">{t.advisory.text}</p>
            <ListItems items={t.advisory.items} />
          </ServiceCard>
        </div>
      </div>
    </section>
  );
}
