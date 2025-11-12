import { RedisClient } from "@/infrastructure/db/redis/redis-client.db";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [RedisClient],
	exports: [RedisClient],
})
export class RedisModule {}
