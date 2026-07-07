import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { ISubscriptionHistoryRepository } from "@/application/interface/repository";
import { SubscriptionHistoryEntity } from "@/domain/entity";
import { SubscriptionHistory } from "../models/sub-history.schema";
import { BaseRepository } from "./base.repository";

@Injectable()
export class SubscriptionHistoryRepository
	extends BaseRepository<SubscriptionHistoryEntity, SubscriptionHistory>
	implements ISubscriptionHistoryRepository<SubscriptionHistoryEntity>
{
	constructor(
		@InjectModel(SubscriptionHistory.name)
		private readonly _subscriptionHistoryModel: Model<SubscriptionHistory>,
	) {
		super(_subscriptionHistoryModel);
	}

	protected toEntity(document: any): SubscriptionHistoryEntity {
		return SubscriptionHistoryEntity.create({
			user_id: document.user_id,
			payment_method: document.payment_method,
			created_at: document.created_at,
			subscription_id: document.subscription_id,
			status: document.status,
			role: document.role,
			id: document._id.toString(),
		});
	}

	protected toDocument(entity: SubscriptionHistoryEntity): any {
		return {
			user_id: entity.user_id,
			payment_method: entity.payment_method,
			created_at: entity.created_at,
			subscription_id: entity.subscription_id,
			status: entity.status,
			role: entity.role,
		};
	}

	async findByUserId(userId: string): Promise<SubscriptionHistoryEntity[] | null> {
		const documents = await this._subscriptionHistoryModel.find({ user_id: userId }).exec();
		if (!documents || documents.length === 0) return null;
		return documents.map((doc) => this.toEntity(doc));
	}
}
