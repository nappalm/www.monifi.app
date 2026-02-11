import { TFunction } from "i18next";

// Category keys
export const categoryKeys = [
  "food",
  "transport",
  "housing",
  "utilities",
  "entertainment",
  "health",
  "education",
  "equipment",
  "clothing",
  "savings",
  "investments",
  "insurance",
  "shopping",
  "personal_care",
  "travel",
  "subscriptions",
  "gifts",
  "debt",
  "taxes",
  "income",
  "other",
] as const;

export type CategoryKey = (typeof categoryKeys)[number];

export const getTranslatedCategories = (t: TFunction) => {
  return categoryKeys.reduce(
    (acc, key) => {
      acc[key] = t(`onboarding.categories.${key}`);
      return acc;
    },
    {} as Record<CategoryKey, string>,
  );
};
