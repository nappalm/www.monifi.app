import { loadStripe } from "@stripe/stripe-js";

const key = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY;
export const stripeClient = loadStripe(key);
