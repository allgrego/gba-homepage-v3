import { getDictionary } from "@/app/[lang]/dictionaries";
import { CheckIcon } from "./icons";

export async function Benefits() {
  const { benefits } = await getDictionary();
  return (
    <section className="border-b border-rule-soft bg-white">
      <div className="wrap py-11">
        <p className="mb-7 text-xl font-light leading-normal">
          {benefits.introLight}{" "}
          <strong className="font-bold text-green-text">{benefits.introBold}</strong>
        </p>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.items.map((item) => (
            <li key={item} className="flex items-start gap-3.5">
              <span className="flex size-7 flex-none items-center justify-center rounded-[2px] bg-blue">
                <CheckIcon />
              </span>
              <p className="text-[15px] font-medium leading-normal">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
