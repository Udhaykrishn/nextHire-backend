import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { RecruiterEntity } from "@/domain/entity";

@Injectable()
export class RecruiterStripeListener {
	private readonly logger = new Logger(RecruiterStripeListener.name);

	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly recruiterRepository: IRecruiterRepository<RecruiterEntity>,
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

			await this.recruiterRepository.save(recruiter);
			this.logger.log(`Successfully updated subscription for recruiter ${payload.userId}`);
		} catch (error) {
			this.logger.error(`Failed to handle stripe.subscription.created for ${payload.userId}:`, error);
		}
	}
}
