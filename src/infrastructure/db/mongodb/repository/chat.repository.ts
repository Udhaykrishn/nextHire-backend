import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "../models/chats.schema";
import { UserDocument } from "../models/user.schema";
import { Recruiter, RecruiterDocument } from "../models/company.schema";
import { ChatEntity } from "@/domain/entity/chat.entity";
import { IChatRepository } from "@/application/interface/repository/chat-repository.interface";
import { ChatPersistenceMapper } from "@/infrastructure/mappers/chat-persistence.mapper";

interface GroupedChatAggregation {
	_id: string;
	lastMessage: string;
	lastMessageTime: Date;
	unreadCount: number;
}

@Injectable()
export class ChatRepository implements IChatRepository {
	private readonly mapper = new ChatPersistenceMapper();

	constructor(
		@InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
		@InjectModel("User") private readonly userModel: Model<UserDocument>,
		@InjectModel(Recruiter.name) private readonly recruiterModel: Model<RecruiterDocument>,
	) {}

	async save(entity: ChatEntity): Promise<ChatEntity> {
		const mongoData = this.mapper.toMongo(entity);
		if (entity.id) {
			await this.chatModel.findByIdAndUpdate(entity.id, mongoData).exec();
			return entity;
		}
		const doc = new this.chatModel(mongoData);
		const saved = await doc.save();
		return this.mapper.fromMongo(saved);
	}

	async findHistory(user1: string, user2: string): Promise<ChatEntity[]> {
		const docs = await this.chatModel
			.find({
				$or: [
					{ sender_id: user1, receiver_id: user2 },
					{ sender_id: user2, receiver_id: user1 },
				],
			})
			.sort({ created_at: 1 })
			.exec();

		return docs.map((doc) => this.mapper.fromMongo(doc));
	}

	async findInbox(userId: string): Promise<
		{
			otherUserId: string;
			otherUserName: string;
			otherUserRole: string;
			lastMessage: string;
			lastMessageTime: Date;
			unreadCount: number;
		}[]
	> {
		const userIdStr = String(userId);

		const chats = (await this.chatModel
			.aggregate([
				{
					$match: {
						$or: [{ sender_id: userIdStr }, { receiver_id: userIdStr }],
					},
				},
				{
					$sort: { created_at: -1 },
				},
				{
					$group: {
						_id: {
							$cond: [{ $eq: ["$sender_id", userIdStr] }, "$receiver_id", "$sender_id"],
						},
						lastMessage: { $first: "$message" },
						lastMessageTime: { $first: "$created_at" },
						unreadCount: {
							$sum: {
								$cond: [
									{
										$and: [{ $eq: ["$receiver_id", userIdStr] }, { $eq: ["$is_viewed", false] }],
									},
									1,
									0,
								],
							},
						},
					},
				},
				{
					$sort: { lastMessageTime: -1 },
				},
			])
			.exec()) as unknown as GroupedChatAggregation[];

		const result: {
			otherUserId: string;
			otherUserName: string;
			otherUserRole: string;
			lastMessage: string;
			lastMessageTime: Date;
			unreadCount: number;
		}[] = [];

		for (const chat of chats) {
			const otherId = chat._id;
			const otherUser = await this.userModel.findById(otherId).exec();
			let role = "CANDIDATE";
			let name = otherUser?.name || "";

			if (!otherUser) {
				const recruiter = await this.recruiterModel.findById(otherId).exec();
				if (recruiter) {
					name = recruiter.name;
					role = "RECRUITER";
				}
			}

			result.push({
				otherUserId: otherId,
				otherUserName: name || "Unknown User",
				otherUserRole: role,
				lastMessage: chat.lastMessage,
				lastMessageTime: chat.lastMessageTime,
				unreadCount: chat.unreadCount,
			});
		}

		return result;
	}

	async markAsViewed(senderId: string, receiverId: string): Promise<void> {
		await this.chatModel
			.updateMany(
				{ sender_id: String(senderId), receiver_id: String(receiverId), is_viewed: false },
				{ is_viewed: true },
			)
			.exec();
	}
}
