import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository, ISubscriptionHistoryRepository } from "@/application/interface/repository";
import { RecruiterEntity, SubscriptionHistoryEntity } from "@/domain/entity";

@Injectable()
export class RecruiterStripeListener {
	private readonly logger = new Logger(RecruiterStripeListener.name);

	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_REPOSITORY)
		private readonly subscriptionHistoryRepository: ISubscriptionHistoryRepository<SubscriptionHistoryEntity>,
	) {}

	@OnEvent("stripe.subscription.created")
	async handleSubscriptionCreated(payload: {
		userId: string;
		stripeCustomerId: string;
		stripeSubscriptionId: string;
		status: string;
	}) {
		this.logger.log(`Handling stripe.subscription.created for recruiter ${payload.userId}`);

		try {
			const recruiter = await this.recruiterRepository.findById(payload.userId);
			if (!recruiter) {
				this.logger.error(`Recruiter not found with ID: ${payload.userId}`);
				return;
			}

			recruiter.changeSubscription({
				current_plan: "pro", // Subscription plans can be dynamic later
				is_subscribed: true,
				stripe_customer_id: payload.stripeCustomerId,
				stripe_subscription_id: payload.stripeSubscriptionId,
				status: payload.status,
			});

			await this.recruiterRepository.findByIdAndUpdate(recruiter.id ?? "", recruiter);

			const history = SubscriptionHistoryEntity.create({
				user_id: payload.userId,
				payment_method: "stripe",
				created_at: new Date().toISOString(),
				subscription_id: payload.stripeSubscriptionId,
				status: payload.status,
				role: "recruiter",
			});
			await this.subscriptionHistoryRepository.create(history);

			this.logger.log(`Successfully updated subscription and history for recruiter ${payload.userId}`);
		} catch (error) {
			this.logger.error(`Failed to handle stripe.subscription.created for ${payload.userId}:`, error);
		}
	}

	@OnEvent("stripe.subscription.updated")
	async handleSubscriptionUpdated(payload: {
		stripeCustomerId: string;
		stripeSubscriptionId: string;
		status: string;
		currentPlan: string;
	}) {
		this.logger.log(`Handling stripe.subscription.updated for customer ${payload.stripeCustomerId}`);

		try {
			const recruiter = await this.recruiterRepository.findByStripeCustomerId(payload.stripeCustomerId);
			if (!recruiter) {
				this.logger.error(`Recruiter not found with Stripe Customer ID: ${payload.stripeCustomerId}`);
				return;
			}

			recruiter.changeSubscription({
				current_plan: payload.status === "active" ? "pro" : "free",
				is_subscribed: payload.status === "active" || payload.status === "trialing",
				stripe_customer_id: payload.stripeCustomerId,
				stripe_subscription_id: payload.stripeSubscriptionId,
				status: payload.status,
			});

			await this.recruiterRepository.findByIdAndUpdate(recruiter.id ?? "", recruiter);

			const history = SubscriptionHistoryEntity.create({
				user_id: recruiter.id ?? "",
				payment_method: "stripe",
				created_at: new Date().toISOString(),
				subscription_id: payload.stripeSubscriptionId,
				status: payload.status,
				role: "recruiter",
			});
			await this.subscriptionHistoryRepository.create(history);

			this.logger.log(`Successfully updated subscription and history for recruiter ${recruiter.id}`);
		} catch (error) {
			this.logger.error(`Failed to handle stripe.subscription.updated for ${payload.stripeCustomerId}:`, error);
		}
	}

	@OnEvent("stripe.subscription.deleted")
	async handleSubscriptionDeleted(payload: { stripeCustomerId: string; stripeSubscriptionId: string }) {
		this.logger.log(`Handling stripe.subscription.deleted for customer ${payload.stripeCustomerId}`);

		try {
			const recruiter = await this.recruiterRepository.findByStripeCustomerId(payload.stripeCustomerId);
			if (!recruiter) {
				this.logger.error(`Recruiter not found with Stripe Customer ID: ${payload.stripeCustomerId}`);
				return;
			}

			recruiter.changeSubscription({
				current_plan: "free",
				is_subscribed: false,
				stripe_customer_id: payload.stripeCustomerId,
				stripe_subscription_id: payload.stripeSubscriptionId,
				status: "canceled",
			});

			await this.recruiterRepository.findByIdAndUpdate(recruiter.id ?? "", recruiter);
			this.logger.log(`Successfully canceled subscription for recruiter ${recruiter.id}`);
		} catch (error) {
			this.logger.error(`Failed to handle stripe.subscription.deleted for ${payload.stripeCustomerId}:`, error);
		}
	}
}
