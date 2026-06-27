import {
	Controller,
	Get,
	Post,
	Patch,
	Param,
	Query,
	Body,
	Req,
	UseGuards,
	Inject,
	HttpStatus,
	HttpCode,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { CHATS_ROUTERS } from "@/presentation/enums/chats-router.enum";
import { CHAT_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ChatEntity } from "@/domain/entity/chat.entity";
import type { SendChatMessageDto } from "@/application/use-case/chat/send-message.use-case";
import type { GetChatHistoryDto } from "@/application/use-case/chat/get-history.use-case";
import type { ChatInboxItem } from "@/application/use-case/chat/get-inbox.use-case";
import type { MarkChatViewedDto } from "@/application/use-case/chat/mark-viewed.use-case";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements/aws-s3.service";

@UseGuards(AuthGuard)
@Controller(CHATS_ROUTERS.ROUTER)
export class ChatsController {
	constructor(
		@Inject(CHAT_TOKEN.SEND_MESSAGE_USE_CASE)
		private readonly _sendMessageUseCase: IExecutable<SendChatMessageDto, ChatEntity>,
		@Inject(CHAT_TOKEN.GET_HISTORY_USE_CASE)
		private readonly _getHistoryUseCase: IExecutable<GetChatHistoryDto, ChatEntity[]>,
		@Inject(CHAT_TOKEN.GET_INBOX_USE_CASE)
		private readonly _getInboxUseCase: IExecutable<string, ChatInboxItem[]>,
		@Inject(CHAT_TOKEN.MARK_VIEWED_USE_CASE)
		private readonly _markViewedUseCase: IExecutable<MarkChatViewedDto, void>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	@Get(CHATS_ROUTERS.HISTORY)
	@HttpCode(HttpStatus.OK)
	async getHistory(@Req() req: AuthenticatedRequest, @Query("otherUserId") otherUserId: string) {
		if (!otherUserId) {
			throw new BadRequestException("otherUserId query parameter is required");
		}
		const messages = await this._getHistoryUseCase.execute({
			userId: req.user.id,
			otherUserId,
		});

		return messages.map((m) => ({
			id: m.id,
			sender_id: m.sender_id,
			receiver_id: m.receiver_id,
			message: m.message,
			is_viewed: m.is_viewed,
			created_at: m.created_at,
			message_type: m.message_type,
			file_url: m.file_url,
			file_name: m.file_name,
			file_size: m.file_size,
			file_key: m.file_key,
		}));
	}

	@Get(CHATS_ROUTERS.INBOX)
	@HttpCode(HttpStatus.OK)
	async getInbox(@Req() req: AuthenticatedRequest) {
		return this._getInboxUseCase.execute(req.user.id);
	}

	@Post(CHATS_ROUTERS.SEND)
	@HttpCode(HttpStatus.CREATED)
	async sendMessage(@Req() req: AuthenticatedRequest, @Body() body: Omit<SendChatMessageDto, "senderId">) {
		const result = await this._sendMessageUseCase.execute({
			...body,
			senderId: req.user.id,
		});

		return {
			id: result.id,
			sender_id: result.sender_id,
			receiver_id: result.receiver_id,
			message: result.message,
			is_viewed: result.is_viewed,
			created_at: result.created_at,
			message_type: result.message_type,
			file_url: result.file_url,
			file_name: result.file_name,
			file_size: result.file_size,
			file_key: result.file_key,
		};
	}

	@Patch(CHATS_ROUTERS.MARK_READ)
	@HttpCode(HttpStatus.OK)
	async markRead(@Req() req: AuthenticatedRequest, @Param("senderId") senderId: string) {
		await this._markViewedUseCase.execute({
			senderId,
			receiverId: req.user.id,
		});
		return { success: true };
	}

	@Post(CHATS_ROUTERS.UPLOAD)
	@HttpCode(HttpStatus.CREATED)
	@UseInterceptors(
		FileInterceptor("file", {
			storage: memoryStorage(),
			limits: {
				fileSize: 5 * 1024 * 1024, // 5MB limit
			},
			fileFilter: (
				_req: AuthenticatedRequest,
				file: Express.Multer.File,
				callback: (error: Error | null, acceptFile: boolean) => void,
			) => {
				const allowedRegex =
					/\/(jpg|jpeg|png|webp|gif|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet|text\/plain)$/;
				if (!file.mimetype.match(allowedRegex)) {
					return callback(new BadRequestException("File type is not allowed in chat!"), false);
				}
				callback(null, true);
			},
		}),
	)
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		const fileInfo = await this._s3Service.uploadFile(file);
		const readUrl = await this._s3Service.getSignedUrlForRead(fileInfo.key);
		return {
			key: fileInfo.key,
			url: readUrl,
			fileName: file.originalname,
			fileSize: file.size,
			fileType: file.mimetype,
		};
	}
}
