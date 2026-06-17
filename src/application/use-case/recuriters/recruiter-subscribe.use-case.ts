import { SubscribeRecruiterDto } from "@/application/dto/recruiter/subscribe-recruiter.dto";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class SubscribeRecruiterUseCase implements IExecutable<SubscribeRecruiterDto, void> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(data: SubscribeRecruiterDto): Promise<void> {
		const recruiter = await this._recruiterRepository.findById(data.recruiterId);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		recruiter.changeSubscription({
			current_plan: data.plan,
			is_subscribed: true,
			stripe_customer_id: recruiter.subscription.stripe_customer_id,
			stripe_subscription_id: recruiter.subscription.stripe_subscription_id,
			status: recruiter.subscription.status,
		});

		// Here we could also Create Subscription Entity and save history
		// but for now updating recruiter status is the priority request.

		await this._recruiterRepository.findByIdAndUpdate(recruiter.id as string, recruiter);
	}
}
