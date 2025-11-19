import { COMMON_TOKEN } from "@/application/enums/tokens";
import { RedisClient } from "@/infrastructure/db/redis/redis-client.db";
import { RedisService } from "@/infrastructure/services/implements";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [
		RedisClient,
		{
			provide: COMMON_TOKEN.REDIS_SERVICE,
			useClass: RedisService,
		},
	],
	exports: [RedisClient, COMMON_TOKEN.REDIS_SERVICE],
})
export class RedisModule {}
