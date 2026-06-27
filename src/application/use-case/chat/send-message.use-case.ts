import { Injectable, Inject, ForbiddenException, NotFoundException } from "@nestjs/common";
import { CHAT_TOKEN, JOB_TOKEN, USERS_TOKEN, NOTIFICATION_TOKEN } from "@/application/enums/tokens";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IChatRepository } from "@/application/interface/repository/chat-repository.interface";
import type { INotificationRepository } from "@/application/interface/repository/notification-repository.interface";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { UserEntity, RecruiterEntity, JobApplicationEntity, JobEntity } from "@/domain/entity";
import { ChatEntity } from "@/domain/entity/chat.entity";
import { NotificationEntity } from "@/domain/entity/notification.entity";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { FilterXSS } from "xss";

const xssFilter = new FilterXSS();

export interface SendChatMessageDto {
	senderId: string;
	receiverId: string;
	message: string;
	messageType?: string;
	fileUrl?: string | null;
	fileName?: string | null;
	fileSize?: number | null;
	fileKey?: string | null;
}

@Injectable()
export class SendMessageUseCase implements IExecutable<SendChatMessageDto, ChatEntity> {
	constructor(
		@Inject(CHAT_TOKEN.CHAT_REPOSITORY)
		private readonly chatRepository: IChatRepository,
		@Inject(NOTIFICATION_TOKEN.NOTIFICATION_REPOSITORY)
		private readonly notificationRepository: INotificationRepository,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly jobRepository: IJobRepository<JobEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly userRepository: IUserRepository<UserEntity>,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async execute(dto: SendChatMessageDto): Promise<ChatEntity> {
		if (!dto.message.trim() && !dto.fileUrl) {
			throw new ForbiddenException("Message content or attachment is required");
		}

		// 0. Sanitize inputs and validate URLs
		const sanitizedMessage = dto.message ? xssFilter.process(dto.message.trim()) : "";
		const sanitizedFileName = dto.fileName ? xssFilter.process(dto.fileName.trim()) : null;
		const validatedFileUrl = dto.fileUrl || null;

		if (validatedFileUrl) {
			const lowerUrl = validatedFileUrl.toLowerCase().trim();
			if (!lowerUrl.startsWith("http://") && !lowerUrl.startsWith("https://")) {
				throw new ForbiddenException("Invalid file URL protocol");
			}
		}

		// 1. Determine sender and receiver roles
		const [senderUser, senderRecruiter] = await Promise.all([
			this.userRepository.findById(dto.senderId),
			this.recruiterRepository.findById(dto.senderId),
		]);

		const senderName = senderUser?.name || senderRecruiter?.name || "Someone";
		const isSenderRecruiter = !!senderRecruiter;

		const [receiverUser, receiverRecruiter] = await Promise.all([
			this.userRepository.findById(dto.receiverId),
			this.recruiterRepository.findById(dto.receiverId),
		]);

		if (!receiverUser && !receiverRecruiter) {
			throw new NotFoundException("Recipient user not found");
		}

		const candidateId = isSenderRecruiter ? dto.receiverId : dto.senderId;
		const recruiterId = isSenderRecruiter ? dto.senderId : dto.receiverId;

		// 2. Verify shortlist constraint
		const apps = await this.jobApplicationRepository.findByUserId(candidateId);
		let hasShortlist = false;

		for (const app of apps) {
			if (app.status === "SHORTLISTED" || app.status === "HIRED") {
				const job = await this.jobRepository.findById(app.jobId);
				if (job && (job.posted_by === recruiterId || job.company_id === recruiterId) && job.is_chat_enabled) {
					hasShortlist = true;
					break;
				}
			}
		}

		if (!hasShortlist) {
			throw new ForbiddenException("You can only chat if the candidate's application is shortlisted");
		}

		// 3. Save Chat message
		const chat = ChatEntity.create({
			sender_id: dto.senderId,
			receiver_id: dto.receiverId,
			message: sanitizedMessage,
			message_type: dto.messageType || "text",
			file_url: validatedFileUrl,
			file_name: sanitizedFileName,
			file_size: dto.fileSize || null,
			file_key: dto.fileKey || null,
		});

		const savedChat = await this.chatRepository.save(chat);

		// 4. Save in-app notification for receiver
		const notifText = dto.messageType === "text" ? sanitizedMessage : `Sent a ${dto.messageType || "file"}`;
		const notification = NotificationEntity.create({
			recipient_id: dto.receiverId,
			title: `New message from ${senderName}`,
			message: notifText,
			type: "chat",
			metadata: {
				senderId: dto.senderId,
				chatId: savedChat.id,
			},
		});

		await this.notificationRepository.save(notification);

		// 5. Emit real-time events for WebSocket server
		this.eventEmitter.emit("chat.message_sent", {
			chat: savedChat,
			notification,
		});

		return savedChat;
	}
}
