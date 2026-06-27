import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { Inject, Logger } from "@nestjs/common";
import { CHAT_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ChatEntity } from "@/domain/entity/chat.entity";
import type { SendChatMessageDto } from "@/application/use-case/chat/send-message.use-case";
import type { MarkChatViewedDto } from "@/application/use-case/chat/mark-viewed.use-case";
import { OnEvent } from "@nestjs/event-emitter";
import type { NotificationEntity } from "@/domain/entity/notification.entity";

export interface AuthenticatedSocket extends Socket {
	user?: {
		id: string;
		email: string;
		role: string;
		permissions: string[];
	};
}

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_API || "http://localhost:3000",
		credentials: true,
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(ChatGateway.name);

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly jwtService: JwtService,
		@Inject(CHAT_TOKEN.SEND_MESSAGE_USE_CASE)
		private readonly sendMessageUseCase: IExecutable<SendChatMessageDto, ChatEntity>,
		@Inject(CHAT_TOKEN.MARK_VIEWED_USE_CASE)
		private readonly markViewedUseCase: IExecutable<MarkChatViewedDto, void>,
	) {}

	async handleConnection(client: Socket) {
		const authSocket = client as AuthenticatedSocket;
		const cookies = client.handshake?.headers?.cookie;
		let token = "";

		if (cookies) {
			const match = cookies.match(/accessToken=([^;]*)/);
			if (match) token = match[1];
		}

		if (!token && client.handshake?.auth?.token) {
			token = client.handshake.auth.token as string;
		}

		if (!token && client.handshake?.query?.token) {
			token = client.handshake.query.token as string;
		}

		if (!token) {
			this.logger.warn(`Connection rejected for client ${client.id}: Missing token`);
			client.disconnect();
			return;
		}

		try {
			const payload = this.jwtService.verify(token);
			authSocket.user = {
				id: payload.id as string,
				email: payload.email as string,
				role: payload.role as string,
				permissions: (payload.permissions || []) as string[],
			};

			const roomName = `user_${authSocket.user.id}`;
			await client.join(roomName);
			this.logger.log(`Client ${client.id} (user: ${authSocket.user.id}) connected & joined room: ${roomName}`);
		} catch {
			this.logger.warn(`Connection rejected for client ${client.id}: Invalid token`);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage("send_message")
	async handleSendMessage(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: {
			receiverId: string;
			message: string;
			messageType?: string;
			fileUrl?: string | null;
			fileName?: string | null;
			fileSize?: number | null;
			fileKey?: string | null;
		},
	) {
		const authSocket = client as AuthenticatedSocket;
		if (!authSocket.user) {
			client.disconnect();
			return;
		}

		try {
			await this.sendMessageUseCase.execute({
				senderId: authSocket.user.id,
				receiverId: payload.receiverId,
				message: payload.message,
				messageType: payload.messageType,
				fileUrl: payload.fileUrl,
				fileName: payload.fileName,
				fileSize: payload.fileSize,
				fileKey: payload.fileKey,
			});
		} catch (error) {
			const errObj = error as Error;
			client.emit("error", { message: errObj.message || "Failed to send message" });
		}
	}

	@SubscribeMessage("mark_read")
	async handleMarkRead(@ConnectedSocket() client: Socket, @MessageBody() payload: { senderId: string }) {
		const authSocket = client as AuthenticatedSocket;
		if (!authSocket.user) {
			client.disconnect();
			return;
		}

		try {
			await this.markViewedUseCase.execute({
				senderId: payload.senderId,
				receiverId: authSocket.user.id,
			});
			// Notify the sender that their messages were read
			this.server.to(`user_${payload.senderId}`).emit("messages_read", {
				readerId: authSocket.user.id,
			});
		} catch (error) {
			this.logger.error("Failed to mark messages as read", error);
		}
	}

	@OnEvent("chat.message_sent")
	handleChatMessageSent(eventPayload: { chat: ChatEntity; notification: NotificationEntity }) {
		const { chat, notification } = eventPayload;
		const chatResponse = {
			id: chat.id,
			sender_id: chat.sender_id,
			receiver_id: chat.receiver_id,
			message: chat.message,
			is_viewed: chat.is_viewed,
			created_at: chat.created_at,
			message_type: chat.message_type,
			file_url: chat.file_url,
			file_name: chat.file_name,
			file_size: chat.file_size,
			file_key: chat.file_key,
		};

		const notifResponse = {
			id: notification.id,
			recipient_id: notification.recipient_id,
			title: notification.title,
			message: notification.message,
			is_read: notification.is_read,
			type: notification.type,
			metadata: notification.metadata,
			createdAt: notification.createdAt,
		};

		// Broadcast new message to recipient and sender rooms
		this.server.to(`user_${chat.receiver_id}`).emit("new_message", chatResponse);
		this.server.to(`user_${chat.sender_id}`).emit("new_message", chatResponse);

		// Broadcast notification to recipient
		this.server.to(`user_${chat.receiver_id}`).emit("notification", notifResponse);
	}

	@OnEvent("notification.dispatched")
	handleNotificationDispatched(notification: NotificationEntity) {
		const notifResponse = {
			id: notification.id,
			recipient_id: notification.recipient_id,
			title: notification.title,
			message: notification.message,
			is_read: notification.is_read,
			type: notification.type,
			metadata: notification.metadata,
			createdAt: notification.createdAt,
		};

		this.server.to(`user_${notification.recipient_id}`).emit("notification", notifResponse);
	}
}
