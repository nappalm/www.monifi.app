import { useTranslation } from "react-i18next";
import RHFSelect from "./RHFSelect";

export default function RHFLanguage() {
  const { t } = useTranslation();

  return (
    <RHFSelect name="language" label={t("common.language.label")}>
      <option value="en">{t("common.language.english")}</option>
      <option value="es">{t("common.language.spanish")}</option>
    </RHFSelect>
  );
}
