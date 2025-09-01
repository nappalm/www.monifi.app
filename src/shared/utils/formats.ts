import { format } from "date-fns";
import { enUS } from "date-fns/locale";

export const formatCurrency = (
  value: number,
  currency: string,
  locale = "en-US",
) => {
  const formattedValue = value / 100;

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  return formatter.format(formattedValue);
};

export const formatDate = (date?: Date | string | number) => {
  if (!date) return "0000 0, 0000";
  return format(new Date(date), "MMMM d, yyyy", {
    locale: enUS,
  });
};
