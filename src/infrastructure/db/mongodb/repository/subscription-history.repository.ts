import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { ISubscriptionHistoryRepository } from "@/application/interface/repository";
import { SubscriptionHistoryEntity } from "@/domain/entity";
import { SubscriptionHistory } from "../models/sub-history.schema";
import { BaseRepository } from "./base.repository";
import { type IBaseMapper } from "@/application/mappers/base-repository.mapper";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";

@Injectable()
export class SubscriptionHistoryRepository
	extends BaseRepository<SubscriptionHistoryEntity, SubscriptionHistory>
	implements ISubscriptionHistoryRepository<SubscriptionHistoryEntity>
{
	constructor(
		@InjectModel(SubscriptionHistory.name)
		private readonly _subscriptionHistoryModel: Model<SubscriptionHistory>,
		@Inject(RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_MAPPER)
		mapper: IBaseMapper<SubscriptionHistoryEntity, SubscriptionHistory>,
	) {
		super(_subscriptionHistoryModel, mapper);
	}

	async findByUserId(userId: string): Promise<SubscriptionHistoryEntity[] | null> {
		const documents = await this._subscriptionHistoryModel.find({ user_id: userId }).exec();
		if (!documents || documents.length === 0) return null;
		return Promise.all(documents.map((doc) => this.mapper.fromMongo(doc)));
	}
}
