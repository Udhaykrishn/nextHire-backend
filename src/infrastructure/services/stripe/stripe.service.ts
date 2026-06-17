import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectStripeClient, StripeWebhookHandler } from "@golevelup/nestjs-stripe";
import Stripe from "stripe";
import { STRIPE_WEBHOOK_EVENTS, STRIPE_REDIRECT_PATHS } from "@/presentation/enums";
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
		const frontendUrl = this.configService.get<string>("STRIPE_FRONTEND_URL");
		const prefix = role === "recruiter" ? "/recruiter" : "/user";

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
			success_url: `${frontendUrl}${prefix}${STRIPE_REDIRECT_PATHS.DASHBOARD}`,
			cancel_url: `${frontendUrl}${prefix}${STRIPE_REDIRECT_PATHS.JOBS}`,
		});

		return { url: session.url };
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
		const subscription = event.data.object;
		this.logger.log(`Subscription updated: ${subscription.id}`);
	}

	@StripeWebhookHandler(STRIPE_WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED)
	handleSubscriptionDeleted(event: StripeWebhookEvent) {
		const subscription = event.data.object;
		this.logger.log(`Subscription deleted: ${subscription.id}`);
	}
}
