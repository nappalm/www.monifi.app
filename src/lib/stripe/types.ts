export type StripeRecurring = {
  aggregate_usage: string | null;
  interval: string;
  interval_count: number;
  meter: string | null;
  trial_period_days: number | null;
  usage_type: string;
};

export type StripePrice = {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: StripeRecurring | null;
};

export type StripeProduct = {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  price: StripePrice;
};
