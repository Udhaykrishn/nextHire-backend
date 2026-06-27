import { Injectable, Inject } from "@nestjs/common";
import { CHAT_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IChatRepository } from "@/application/interface/repository/chat-repository.interface";

export interface ChatInboxItem {
	otherUserId: string;
	otherUserName: string;
	otherUserRole: string;
	lastMessage: string;
	lastMessageTime: Date;
	unreadCount: number;
}

@Injectable()
export class GetInboxUseCase implements IExecutable<string, ChatInboxItem[]> {
	constructor(
		@Inject(CHAT_TOKEN.CHAT_REPOSITORY)
		private readonly chatRepository: IChatRepository,
	) {}

	async execute(userId: string): Promise<ChatInboxItem[]> {
		return this.chatRepository.findInbox(userId);
	}
}
