export type LicensingFeatureType = "unlimited" | "check" | "uncheck";

type LicensingFeature = {
  type: LicensingFeatureType;
  labelKey: string;
};

export const LICENSING_PRO_FEATURES: LicensingFeature[] = [
  {
    type: "unlimited",
    labelKey: "settings.licensing.features.unlimitedBudgets",
  },
  {
    type: "unlimited",
    labelKey: "settings.licensing.features.unlimitedTransactions",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.advancedBudgetManagement",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.completeIncomeExpenseControl",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.customTransactionCategorization",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.savingsTrackingOptimization",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.creditCardMonitoring",
  },
  { type: "check", labelKey: "settings.licensing.features.debtManagement" },
  {
    type: "check",
    labelKey: "settings.licensing.features.detailedFinancialReports",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.aiExpenseOptimization",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.aiBudgetRecommendations",
  },
  {
    type: "check",
    labelKey: "settings.licensing.features.personalizedInsights",
  },
  { type: "check", labelKey: "settings.licensing.features.prioritySupport" },
  { type: "check", labelKey: "settings.licensing.features.exportData" },
];

type LicensingFreeFeature = {
  included: LicensingFeature[];
  notIncluded: LicensingFeature[];
};
export const LICENSING_FREE_FEATURES: LicensingFreeFeature = {
  included: [
    {
      labelKey: "settings.licensing.features.basicBudgetManagement",
      type: "check",
    },
    {
      labelKey: "settings.licensing.features.incomeExpenseTracking",
      type: "check",
    },
    {
      labelKey: "settings.licensing.features.transactionCategorization",
      type: "check",
    },
    {
      labelKey: "settings.licensing.features.savingsMonitoring",
      type: "check",
    },
    { labelKey: "settings.licensing.features.financialReports", type: "check" },
    {
      labelKey: "settings.licensing.features.creditCardControl",
      type: "check",
    },
    { labelKey: "settings.licensing.features.communitySupport", type: "check" },
  ],
  notIncluded: [
    {
      labelKey: "settings.licensing.features.advancedBudgetManagement",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.completeIncomeExpenseControl",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.customTransactionCategorization",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.savingsTrackingOptimization",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.creditCardMonitoring",
      type: "uncheck",
    },
    { labelKey: "settings.licensing.features.debtManagement", type: "uncheck" },
    {
      labelKey: "settings.licensing.features.detailedFinancialReports",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.aiExpenseOptimization",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.aiBudgetRecommendations",
      type: "uncheck",
    },
    {
      labelKey: "settings.licensing.features.personalizedInsights",
      type: "uncheck",
    },
  ],
};
