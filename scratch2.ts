import Stripe from "stripe";
import type { Stripe as StripeTypes } from "stripe";
const stripe = new Stripe("sk_test", { apiVersion: "2024-04-10" });
let event: StripeTypes.Event;
let session: StripeTypes.Checkout.Session;
