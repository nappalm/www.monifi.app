export type OnSubmitChangePassword = {
  password: string;
  repeat_password: string;
};

export type OnSubmitProfile = {
  name: string;
  email: string;
  currency: string;
  language: string;
};

export type OnUpgrade = {
  priceId: string;
  paymentMethodId: string;
};
