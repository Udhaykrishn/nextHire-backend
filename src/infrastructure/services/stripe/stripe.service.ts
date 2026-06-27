import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectStripeClient, StripeWebhookHandler } from "@golevelup/nestjs-stripe";
import Stripe from "stripe";
import { STRIPE_WEBHOOK_EVENTS } from "@/presentation/enums";
import { EventEmitter2 } from "@nestjs/event-emitter";

interface StripeWebhookEvent {
	id: string;
	type: string;
	data: {
		object: Record<string, unknown> & { id: string; object: string };
	};
}

@Injectable()
export class StripeService {
	private readonly logger = new Logger(StripeService.name);

	constructor(
		@InjectStripeClient() private readonly stripe: InstanceType<typeof Stripe>,
		private configService: ConfigService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	public getStripeInstance(): InstanceType<typeof Stripe> {
		return this.stripe;
	}

	public async createCheckoutSession(
		priceId: string,
		userId: string,
		email: string,
		role: string = "recruiter",
	): Promise<{ url: string | null }> {
		const baseFrontendUrl = (
			this.configService.get<string>("FRONTEND_API") ||
			this.configService.get<string>("STRIPE_FRONTEND_URL") ||
			"http://localhost:3000"
		).replace(/\/recruiter$/, "");

		const normalizedRole = role.toLowerCase();
		let successUrl = "";
		let cancelUrl = "";

		if (normalizedRole === "recruiter") {
			successUrl = `${baseFrontendUrl}/recruiter/plan/success`;
			cancelUrl = `${baseFrontendUrl}/recruiter/plan`;
		} else {
			successUrl = `${baseFrontendUrl}/pricing/success`;
			cancelUrl = `${baseFrontendUrl}/pricing`;
		}

		try {
			const sessions = await this.stripe.checkout.sessions.list({
				limit: 20,
			});

			const activeSession = sessions.data.find(
				(s) =>
					s.client_reference_id === userId && s.status === "open" && s.metadata?.priceId === priceId && s.url,
			);

			if (activeSession) {
				this.logger.log(`Resuming existing active Stripe session: ${activeSession.id}`);
				return { url: activeSession.url };
			}
		} catch (err) {
			this.logger.error("Failed to check for existing checkout sessions", err);
		}

		// @ts-expect-error upi is supported by the API but missing from older Stripe SDK types
		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ["card", "upi"],
			currency: this.configService.get<string>("STRIPE_CURRENCY"),
			mode: "subscription",
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			customer_email: email,
			client_reference_id: userId,
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: {
				priceId,
			},
		});

		return { url: session.url };
	}

	public mockSuccess(userId: string) {
		const nodeEnv = this.configService.get<string>("NODE_ENV") || "development";
		if (nodeEnv === "production") {
			throw new Error("Mocking subscription is not allowed in production");
		}

		this.eventEmitter.emit("stripe.subscription.created", {
			userId,
			stripeCustomerId: `mock_customer_${Math.random().toString(36).substring(2, 11)}`,
			stripeSubscriptionId: `mock_sub_${Math.random().toString(36).substring(2, 11)}`,
			status: "active",
		});
	}

	@StripeWebhookHandler(STRIPE_WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED)
	handleCheckoutSessionCompleted(event: StripeWebhookEvent) {
		const session = event.data.object as unknown as Stripe.Checkout.Session;
		this.logger.log(`Checkout session completed: ${session.id}`);

		if (session.client_reference_id) {
			this.eventEmitter.emit("stripe.subscription.created", {
				userId: session.client_reference_id,
				stripeCustomerId: session.customer as string,
				stripeSubscriptionId: session.subscription as string,
				status: "active",
			});
		}
	}

	@StripeWebhookHandler(STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED)
	handleSubscriptionUpdated(event: StripeWebhookEvent) {
		const subscription = event.data.object as unknown as Stripe.Subscription;
		this.logger.log(`Subscription updated: ${subscription.id}`);

		this.eventEmitter.emit("stripe.subscription.updated", {
			stripeCustomerId: subscription.customer as string,
			stripeSubscriptionId: subscription.id,
			status: subscription.status,
			currentPlan: subscription.items.data[0]?.price.id || "free",
		});
	}

	@StripeWebhookHandler(STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED)
	handleSubscriptionDeleted(event: StripeWebhookEvent) {
		const subscription = event.data.object as unknown as Stripe.Subscription;
		this.logger.log(`Subscription deleted: ${subscription.id}`);

		this.eventEmitter.emit("stripe.subscription.deleted", {
			stripeCustomerId: subscription.customer as string,
			stripeSubscriptionId: subscription.id,
			status: "canceled",
		});
	}
}
