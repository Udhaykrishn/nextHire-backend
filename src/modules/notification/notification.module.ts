import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { NotificationListener } from "@/infrastructure/event-listeners/notification.listener";

@Module({
    imports: [
        BullModule.registerQueue({
            name: "notification-queue",
        }),
    ],
    providers: [NotificationListener],
    exports: [BullModule],
})
export class NotificationModule { }
