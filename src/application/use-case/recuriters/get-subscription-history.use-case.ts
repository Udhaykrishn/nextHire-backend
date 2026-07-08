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

	async execute(input: { userId: string; page: number; limit: number }) {
		const { userId, page, limit } = input;
		return this.subscriptionHistoryRepository.findPageByUserId(userId, page, limit);
	}
}
