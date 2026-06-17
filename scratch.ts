import Stripe from "stripe";
const stripe = new Stripe("sk_test", { apiVersion: "2024-04-10" });
const event = stripe.webhooks.constructEvent("payload", "sig", "secret");
const session = event.data.object;
