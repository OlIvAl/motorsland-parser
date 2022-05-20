import i18next from "i18next";
import { ru as integrationErrors } from "./resources/integrationErrors";
import { ru as titles } from "./resources/titles";

export async function getI18Next(
  i18nInstance: typeof i18next
): Promise<typeof i18next> {
  await i18nInstance.init({
    resources: { ru: { ...integrationErrors, ...titles } },
    lng: "ru",
    keySeparator: ".",
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18n: "languageChanged",
      bindI18nStore: "added",
      transEmptyNodeValue: "",
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
      useSuspense: true,
    },
  });

  return i18nInstance;
}
