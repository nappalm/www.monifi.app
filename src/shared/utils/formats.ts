import { format } from "date-fns";
import { enUS } from "date-fns/locale";

// Mapeo de monedas a sus locales nativos para formato correcto
const currencyLocaleMap: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE", // Alemania: símbolo al final
  JPY: "ja-JP",
  GBP: "en-GB",
  AUD: "en-AU",
  CAD: "en-CA",
  CHF: "fr-CH", // Suiza francés: muestra Fr. al final
  CNH: "zh-CN",
  HKD: "zh-HK",
  NZD: "en-NZ",
  MXN: "es-MX",
};

export const formatCurrency = (
  value: number,
  currency?: string,
  locale?: string,
) => {
  const formattedValue = value;
  const usedCurrency = currency || "USD";

  // Usar el locale específico de la moneda si no se proporciona uno
  const usedLocale = locale || currencyLocaleMap[usedCurrency] || "en-US";

  const formatter = new Intl.NumberFormat(usedLocale, {
    style: "currency",
    currency: usedCurrency,
    currencyDisplay: "narrowSymbol",
  });

  return formatter.format(formattedValue);
};

export const formatDate = (date?: Date | string | number) => {
  if (!date) return "0000 0, 0000";
  return format(new Date(date), "MMM d, yyyy", {
    locale: enUS,
  });
};
