import { contactEmail } from "@/lib/site";
import { getDictionary } from "@/app/[lang]/dictionaries";

export async function UtilityBar() {
  const { utility } = await getDictionary();
  return (
    <div className="bg-navy-deep text-[13px] text-[#d8e1ed]">
      <div className="wrap flex flex-wrap items-center justify-start gap-x-4 gap-y-1.5 py-2.5 sm:justify-between">
        <span>{utility.location}</span>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </div>
    </div>
  );
}
