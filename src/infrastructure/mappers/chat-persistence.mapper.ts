import { ChatEntity } from "@/domain/entity/chat.entity";
import type { ChatDocument } from "../db/mongodb/models/chats.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatPersistenceMapper {
	toMongo(entity: ChatEntity) {
		return {
			_id: entity.id,
			sender_id: entity.sender_id,
			receiver_id: entity.receiver_id,
			message: entity.message,
			is_viewed: entity.is_viewed,
			created_at: entity.created_at,
			message_type: entity.message_type,
			file_url: entity.file_url,
			file_name: entity.file_name,
			file_size: entity.file_size,
			file_key: entity.file_key,
		};
	}

	fromMongo(doc: ChatDocument): ChatEntity {
		return ChatEntity.create({
			id: doc._id.toString(),
			sender_id: doc.sender_id,
			receiver_id: doc.receiver_id,
			message: doc.message,
			is_viewed: doc.is_viewed,
			created_at: doc.created_at,
			message_type: doc.message_type,
			file_url: doc.file_url,
			file_name: doc.file_name,
			file_size: doc.file_size,
			file_key: doc.file_key,
		});
	}
}
