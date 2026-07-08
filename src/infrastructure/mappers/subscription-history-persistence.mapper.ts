import type { IBaseMapper } from "@/application/mappers/base-repository.mapper";
import { SubscriptionHistoryEntity } from "@/domain/entity/subscription-history.entity";
import type { SubscriptionHistory } from "../db/mongodb/models/sub-history.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SubscriptionHistoryPersistenceMapper
	implements IBaseMapper<SubscriptionHistoryEntity, SubscriptionHistory>
{
	fromMongo(document: SubscriptionHistory): SubscriptionHistoryEntity {
		const doc = document as unknown as Record<string, unknown>;
		return SubscriptionHistoryEntity.create({
			user_id: document.user_id,
			payment_method: document.payment_method,
			created_at: document.created_at,
			subscription_id: document.subscription_id,
			status: document.status,
			role: document.role,
			id: (doc._id as { toString(): string }).toString(),
		});
	}

	toMongo(entity: SubscriptionHistoryEntity): SubscriptionHistory;
	toMongo(entity: Partial<SubscriptionHistoryEntity>): Partial<SubscriptionHistory>;
	toMongo(
		entity: SubscriptionHistoryEntity | Partial<SubscriptionHistoryEntity>,
	): SubscriptionHistory | Partial<SubscriptionHistory> {
		return {
			user_id: entity.user_id,
			payment_method: entity.payment_method,
			created_at: entity.created_at,
			subscription_id: entity.subscription_id,
			status: entity.status,
			role: entity.role,
		} as SubscriptionHistory | Partial<SubscriptionHistory>;
	}
}
