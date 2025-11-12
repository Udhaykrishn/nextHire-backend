import Redis from "ioredis";
import {
	Injectable,
	Logger,
	type OnModuleInit,
	type OnModuleDestroy,
} from "@nestjs/common";

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
	private static instance: Redis;
	private readonly logger = new Logger(RedisClient.name);

	private connect() {
		if (!RedisClient.instance) {
			const url = process.env.REDIS_URL || "";

			RedisClient.instance = new Redis(url, {
				retryStrategy: (times) =>
					times > 10 ? null : Math.min(times * 500, 3000),
				maxRetriesPerRequest: 3,
				lazyConnect: false,
				enableOfflineQueue: true,
			});

			RedisClient.instance.on("connect", () =>
				console.log("Redis connected successfully"),
			);
			RedisClient.instance.on("ready", () => console.log("Redis is ready"));
			RedisClient.instance.on("error", (err) =>
				console.error("Redis error:", err.message),
			);
			RedisClient.instance.on("close", () =>
				console.warn("Redis connection closed"),
			);
			RedisClient.instance.on("reconnecting", ({ delay }) =>
				console.log(`Redis reconnecting in ${delay}ms...`),
			);
		}
		return RedisClient.instance;
	}

	get client(): Redis {
		return RedisClient.instance || this.connect();
	}

	async onModuleInit() {
		try {
			await this.client.ping();
			this.logger.log("Redis connected and responsive");
		} catch (error) {
			this.logger.error("Redis connection failed", error.stack);
			throw error;
		}
	}

	async onModuleDestroy() {
		if (RedisClient.instance?.status !== "end") {
			await RedisClient.instance.quit();
			console.log("Redis disconnected");
		}
	}
}
