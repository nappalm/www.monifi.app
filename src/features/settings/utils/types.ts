export type OnSubmitChangePassword = {
  password: string;
  repeat_password: string;
};

export type OnSubmitProfile = {
  name: string;
  email: string;
};

export type OnUpgrade = {
  priceId: string;
  paymentMethodId: string;
};
