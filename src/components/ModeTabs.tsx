"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export function ModeTabs({ t }: { t: Dictionary["needs"]["byMode"] }) {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = t.tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    document.getElementById(tabId(next))?.focus();
  };

  return (
    <div className="mt-14 bg-tint px-6 py-7 sm:p-9 lg:px-10">
      <h3 className="mb-1.5 text-[22px] font-bold text-navy">{t.title}</h3>
      <p className="mb-[22px] text-[15px] text-muted">{t.intro}</p>

      <div
        role="tablist"
        aria-label={t.tabsAria}
        onKeyDown={onKeyDown}
        className="mb-7 flex max-w-full flex-wrap overflow-hidden rounded-[2px] border-[1.5px] border-navy sm:w-fit"
      >
        {t.tabs.map((tab, i) => (
          <button
            key={tab.id}
            id={tabId(i)}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={panelId}
            tabIndex={active === i ? 0 : -1}
            className="seg-btn"
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        className="grid grid-cols-1 lg:grid-cols-3"
      >
        {t.tabs[active].items.map((item) => (
          <div
            key={item.title}
            className="mb-5 border-b border-[#c5d2e4] pb-5 last:mb-0 last:border-b-0 last:pb-0 lg:mb-0 lg:mr-8 lg:border-b-0 lg:border-r lg:py-1 lg:pb-1 lg:pr-8 lg:last:mr-0 lg:last:border-r-0"
          >
            <h4 className="mb-2 text-base font-bold text-navy">{item.title}</h4>
            <p className="text-[15px] leading-[1.55]">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
