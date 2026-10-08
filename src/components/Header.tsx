import { getDictionary, getLocale } from "@/app/[lang]/dictionaries";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const [t, lang] = await Promise.all([getDictionary(), getLocale()]);
  return <HeaderClient t={t.nav} lang={lang} />;
}
