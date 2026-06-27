import { Injectable, Logger, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { JOB_EVENTS } from "@/domain/enums/events.enum";
import { CHAT_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { SendChatMessageDto } from "@/application/use-case/chat/send-message.use-case";
import type { ChatEntity } from "@/domain/entity/chat.entity";
import type { IChatRepository } from "@/application/interface/repository/chat-repository.interface";

interface ApplicationStatusUpdatedPayload {
	candidateId: string;
	recruiterId?: string;
	previousStatus?: string;
	status: string;
	jobTitle: string;
	companyName: string;
}

@Injectable()
export class ChatGreetingListener {
	private readonly logger = new Logger(ChatGreetingListener.name);

	constructor(
		@Inject(CHAT_TOKEN.SEND_MESSAGE_USE_CASE)
		private readonly sendMessageUseCase: IExecutable<SendChatMessageDto, ChatEntity>,
		@Inject(CHAT_TOKEN.CHAT_REPOSITORY)
		private readonly chatRepository: IChatRepository,
	) {}

	// When a candidate is shortlisted, the recruiter opens the conversation with a
	// greeting. This seeds the candidate's inbox and fires the chat notification,
	// so the chat is no longer empty when the candidate opens it.
	@OnEvent(JOB_EVENTS.APPLICATION_STATUS_UPDATED)
	async handleShortlistGreeting(payload: ApplicationStatusUpdatedPayload) {
		if (payload.status !== "SHORTLISTED" || payload.previousStatus === "SHORTLISTED") {
			return;
		}
		if (!payload.recruiterId || !payload.candidateId) {
			return;
		}

		try {
			// Don't double-greet if the two already have a conversation.
			const existing = await this.chatRepository.findHistory(payload.recruiterId, payload.candidateId);
			if (existing.length > 0) {
				return;
			}

			const greeting = `Hi 👋 Thanks for applying to "${payload.jobTitle}" at ${payload.companyName}. We've shortlisted you — happy to answer any questions here!`;

			await this.sendMessageUseCase.execute({
				senderId: payload.recruiterId,
				receiverId: payload.candidateId,
				message: greeting,
				messageType: "text",
			});
		} catch (error) {
			// Greeting is best-effort; never block the status update flow.
			this.logger.error(
				`Failed to send shortlist greeting (recruiter=${payload.recruiterId}, candidate=${payload.candidateId})`,
				error as Error,
			);
		}
	}
}
