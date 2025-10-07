import { useTranslation } from "react-i18next";
import RHFSelect from "./RHFSelect";

export default function RHFCurrency() {
  const { t } = useTranslation();

  return (
    <RHFSelect name="currency" label={t("common.currency.label")}>
      <option value="USD">USD (United States Dollar)</option>
      <option value="EUR">EUR (Euro)</option>
      <option value="JPY">JPY (Japanese Yen)</option>
      <option value="GBP">GBP (British Pound Sterling)</option>
      <option value="AUD">AUD (Australian Dollar)</option>
      <option value="CAD">CAD (Canadian Dollar)</option>
      <option value="CHF">CHF (Swiss Franc)</option>
      <option value="CNH">CNH (Chinese Yuan Renminbi)</option>
      <option value="HKD">HKD (Hong Kong Dollar)</option>
      <option value="NZD">NZD (New Zealand Dollar)</option>
      <option value="MXN">MXN (Mexican Peso)</option>
    </RHFSelect>
  );
}
