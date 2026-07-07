import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "@/infrastructure/db/mongodb/models/chats.schema";
import { ChatRepository } from "@/infrastructure/db/mongodb/repository/chat.repository";
import { ChatPersistenceMapper } from "@/infrastructure/mappers/chat-persistence.mapper";
import { CHAT_TOKEN } from "@/application/enums/tokens";
import { SendMessageUseCase } from "@/application/use-case/chat/send-message.use-case";
import { GetHistoryUseCase } from "@/application/use-case/chat/get-history.use-case";
import { GetInboxUseCase } from "@/application/use-case/chat/get-inbox.use-case";
import { MarkViewedUseCase } from "@/application/use-case/chat/mark-viewed.use-case";
import { ChatsController } from "@/presentation/controller/chat/chats.controller";
import { ChatGateway } from "@/presentation/gateway/chat.gateway";
import { ChatGreetingListener } from "@/infrastructure/event-listeners/chat-greeting.listener";
import { JobLiteModule } from "../job/job-lite.module";
import { UserLiteModule } from "../user/user-db.module";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		JobLiteModule,
		UserLiteModule,
		RecruiterLiteModule,
		NotificationModule,
	],
	controllers: [ChatsController],
	providers: [
		ChatGateway,
		ChatGreetingListener,
		ChatPersistenceMapper,
		{
			provide: CHAT_TOKEN.CHAT_REPOSITORY,
			useClass: ChatRepository,
		},
		{
			provide: CHAT_TOKEN.SEND_MESSAGE_USE_CASE,
			useClass: SendMessageUseCase,
		},
		{
			provide: CHAT_TOKEN.GET_HISTORY_USE_CASE,
			useClass: GetHistoryUseCase,
		},
		{
			provide: CHAT_TOKEN.GET_INBOX_USE_CASE,
			useClass: GetInboxUseCase,
		},
		{
			provide: CHAT_TOKEN.MARK_VIEWED_USE_CASE,
			useClass: MarkViewedUseCase,
		},
	],
	exports: [
		CHAT_TOKEN.CHAT_REPOSITORY,
		CHAT_TOKEN.SEND_MESSAGE_USE_CASE,
		CHAT_TOKEN.GET_HISTORY_USE_CASE,
		CHAT_TOKEN.GET_INBOX_USE_CASE,
		CHAT_TOKEN.MARK_VIEWED_USE_CASE,
	],
})
export class ChatModule {}
