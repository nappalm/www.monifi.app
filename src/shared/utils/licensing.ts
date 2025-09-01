export type LicensingFeatureType = "unlimited" | "check" | "uncheck";

type LicensingFeature = {
  type: LicensingFeatureType;
  label: string;
};

export const LICENSING_PRO_FEATURES: LicensingFeature[] = [
  { type: "unlimited", label: "Unlimited public/private repos" },
  { type: "unlimited", label: "Unlimited collaborators" },
  { type: "check", label: "2,000 Actions minutes/month" },
  { type: "check", label: "500MB of Packages storage" },
  {
    type: "check",
    label: "120 core-hours of Codespaces compute per developer",
  },
  { type: "check", label: "15GB of Codespaces storage per developer" },
  { type: "check", label: "Community support" },
  { type: "check", label: "Free Codespaces usage per organization" },
  { type: "check", label: "Protected branches on all repos" },
  { type: "check", label: "Increase Codespaces spend limits" },
  { type: "check", label: "Multiple reviewers in pull requests" },
  { type: "check", label: "Required status checks" },
  { type: "check", label: "Code owners" },
  { type: "check", label: "Required reviewers" },
  { type: "check", label: "Pages for static website hosting" },
  { type: "check", label: "Web-based support" },
];

type LicensingFreeFeature = {
  included: LicensingFeature[];
  notIncluded: LicensingFeature[];
};
export const LICENSING_FREE_FEATURES: LicensingFreeFeature = {
  included: [
    { label: "Unlimited public/private repos", type: "unlimited" },
    { label: "Unlimited collaborators", type: "unlimited" },
    { label: "2,000 Actions minutes/month", type: "check" },
    { label: "500MB of Packages storage", type: "check" },
    {
      label: "120 core-hours of Codespaces compute per developer",
      type: "check",
    },
    { label: "15GB of Codespaces storage per developer", type: "check" },
    { label: "Community support", type: "check" },
  ],
  notIncluded: [
    { label: "Free Codespaces usage per organization", type: "uncheck" },
    { label: "Protected branches on all repos", type: "uncheck" },
    { label: "Increase Codespaces spend limits", type: "uncheck" },
    { label: "Multiple reviewers in pull requests", type: "uncheck" },
    { label: "Required status checks", type: "uncheck" },
    { label: "Code owners", type: "uncheck" },
    { label: "Required reviewers", type: "uncheck" },
    { label: "Pages for static website hosting", type: "uncheck" },
    { label: "Web-based support", type: "uncheck" },
  ],
};
