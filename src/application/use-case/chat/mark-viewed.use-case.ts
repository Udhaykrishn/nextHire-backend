import { Injectable, Inject } from "@nestjs/common";
import { CHAT_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IChatRepository } from "@/application/interface/repository/chat-repository.interface";

export interface MarkChatViewedDto {
	senderId: string;
	receiverId: string;
}

@Injectable()
export class MarkViewedUseCase implements IExecutable<MarkChatViewedDto, void> {
	constructor(
		@Inject(CHAT_TOKEN.CHAT_REPOSITORY)
		private readonly chatRepository: IChatRepository,
	) {}

	async execute(dto: MarkChatViewedDto): Promise<void> {
		await this.chatRepository.markAsViewed(dto.senderId, dto.receiverId);
	}
}
