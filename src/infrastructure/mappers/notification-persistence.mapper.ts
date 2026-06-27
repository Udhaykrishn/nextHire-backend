import { NotificationEntity } from "@/domain/entity/notification.entity";
import type { NotificationDocument } from "../db/mongodb/models/notification.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationPersistenceMapper {
	toMongo(entity: NotificationEntity) {
		return {
			_id: entity.id,
			recipient_id: entity.recipient_id,
			title: entity.title,
			message: entity.message,
			is_read: entity.is_read,
			type: entity.type,
			metadata: entity.metadata || {},
		};
	}

	fromMongo(doc: NotificationDocument): NotificationEntity {
		const rawDoc = doc as unknown as { createdAt?: Date };
		return NotificationEntity.create({
			id: doc._id.toString(),
			recipient_id: doc.recipient_id,
			title: doc.title,
			message: doc.message,
			is_read: doc.is_read,
			type: doc.type,
			metadata: doc.metadata,
			createdAt: rawDoc.createdAt || new Date(),
		});
	}
}
