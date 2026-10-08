import { getDictionary } from "@/app/[lang]/dictionaries";

export async function MissionVision() {
  const { missionVision: t } = await getDictionary();

  return (
    <section className="sec-pad">
      <div className="wrap">
        <div className="flex flex-col lg:flex-row">
          <div className="mv-a flex-1 bg-blue px-7 py-9 text-white sm:p-9 lg:py-12 lg:pl-12 lg:pr-[88px]">
            <p className="text-base">{t.mission.kicker}</p>
            <h2 className="mb-4 mt-0.5 text-4xl font-bold">{t.mission.title}</h2>
            <p className="text-lg font-medium leading-[1.65]">{t.mission.text}</p>
          </div>
          <div className="mv-b flex-1 bg-green px-7 py-9 text-ink sm:p-9 lg:py-12 lg:pl-24 lg:pr-12">
            <p className="text-base font-medium">{t.vision.kicker}</p>
            <h2 className="mb-4 mt-0.5 text-4xl font-bold">{t.vision.title}</h2>
            <p className="text-lg font-medium leading-[1.65]">{t.vision.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
