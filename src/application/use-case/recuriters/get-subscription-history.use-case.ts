import { Inject, Injectable } from "@nestjs/common";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { ISubscriptionHistoryRepository } from "@/application/interface/repository";
import type { SubscriptionHistoryEntity } from "@/domain/entity";

@Injectable()
export class GetSubscriptionHistoryUseCase {
	constructor(
		@Inject(RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_REPOSITORY)
		private readonly subscriptionHistoryRepository: ISubscriptionHistoryRepository<SubscriptionHistoryEntity>,
	) {}

	async execute(userId: string) {
		const history = await this.subscriptionHistoryRepository.findByUserId(userId);
		return history || [];
	}
}
