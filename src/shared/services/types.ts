export type SignInWithPassword = {
  email: string;
  password: string;
};

export type SignUpWithPassword = {
  email: string;
  password: string;
};

export type OAuthProvider =
  | "apple"
  | "azure"
  | "bitbucket"
  | "discord"
  | "facebook"
  | "figma"
  | "github"
  | "gitlab"
  | "google"
  | "kakao"
  | "keycloak"
  | "linkedin"
  | "notion"
  | "slack"
  | "spotify"
  | "twitch"
  | "twitter"
  | "workos"
  | "zoom";

export type UpdateProfile = {
  uuid: string;
  name: string;
};

export type StripeCreateSubscription = {
  priceId: string;
  paymentMethodId: string;
};

export type StripeCreatePaymentMethod = {
  paymentMethodId: string;
};

export type StripeDownloadInvoice = {
  invoiceId: string;
};
