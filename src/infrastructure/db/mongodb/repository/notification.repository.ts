import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "../models/notification.schema";
import { NotificationEntity } from "@/domain/entity/notification.entity";
import { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";
import { NotificationPersistenceMapper } from "@/infrastructure/mappers/notification-persistence.mapper";

@Injectable()
export class NotificationRepository implements INotificationRepository {
	private readonly mapper = new NotificationPersistenceMapper();

	constructor(
		@InjectModel(Notification.name)
		private readonly model: Model<NotificationDocument>,
	) {}

	async save(entity: NotificationEntity): Promise<NotificationEntity> {
		const mongoData = this.mapper.toMongo(entity);
		if (entity.id) {
			await this.model.findByIdAndUpdate(entity.id, mongoData).exec();
			return entity;
		}
		const doc = new this.model(mongoData);
		const saved = await doc.save();
		return this.mapper.fromMongo(saved);
	}

	async findByRecipient(recipientId: string): Promise<NotificationEntity[]> {
		const docs = await this.model
			.find({ recipient_id: String(recipientId) })
			.sort({ createdAt: -1 })
			.exec();
		const entities: NotificationEntity[] = [];
		for (const doc of docs) {
			entities.push(this.mapper.fromMongo(doc));
		}
		return entities;
	}

	async findById(id: string): Promise<NotificationEntity | null> {
		const doc = await this.model.findById(id).exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}

	async update(id: string, entity: NotificationEntity): Promise<void> {
		const mongoData = this.mapper.toMongo(entity);
		await this.model.findByIdAndUpdate(id, mongoData).exec();
	}

	async markAllAsRead(recipientId: string): Promise<void> {
		await this.model.updateMany({ recipient_id: String(recipientId), is_read: false }, { is_read: true }).exec();
	}

	async getUnreadCount(recipientId: string): Promise<number> {
		return this.model.countDocuments({ recipient_id: String(recipientId), is_read: false }).exec();
	}
}
