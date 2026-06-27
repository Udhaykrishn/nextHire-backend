import { ChatEntity } from "@/domain/entity/chat.entity";

export interface IChatRepository {
	save(chat: ChatEntity): Promise<ChatEntity>;
	findHistory(user1: string, user2: string): Promise<ChatEntity[]>;
	findInbox(userId: string): Promise<
		{
			otherUserId: string;
			otherUserName: string;
			otherUserRole: string;
			lastMessage: string;
			lastMessageTime: Date;
			unreadCount: number;
		}[]
	>;
	markAsViewed(senderId: string, receiverId: string): Promise<void>;
}
