import { RedisClient } from "@/infrastructure/db/redis/redis-client.db";
import { Injectable, Logger } from "@nestjs/common";
import type Redis from "ioredis";
import type { IRedisService } from "../interface";

@Injectable()
export class RedisService implements IRedisService {
	private readonly logger = new Logger(RedisService.name);
	private readonly client: Redis;

	constructor(readonly redisClient: RedisClient) {
		this.client = redisClient.client;
	}

	async set(key: string, value: string, expirySeconds?: number): Promise<void> {
		try {
			if (expirySeconds) {
				await this.client.setex(key, expirySeconds, value);
			} else {
				await this.client.set(key, value);
			}
			this.logger.debug(`Set key: ${key}`);
		} catch (error) {
			this.logger.error(`Failed to set key ${key}:`, error);
			throw error;
		}
	}

	async get(key: string): Promise<string | null> {
		try {
			const value = await this.client.get(key);
			this.logger.debug(`Got key: ${key} (${value ? "exists" : "missing"})`);
			return value;
		} catch (error) {
			this.logger.error(`Failed to get key ${key}:`, error);
			throw error;
		}
	}

	async del(key: string): Promise<void> {
		try {
			await this.client.del(key);
			this.logger.debug(`Deleted key: ${key}`);
		} catch (error) {
			this.logger.error(`Failed to delete key ${key}:`, error);
			throw error;
		}
	}

	async ttl(key: string): Promise<number> {
		try {
			const time = await this.client.ttl(key);
			this.logger.debug(`TTL for ${key}: ${time}`);
			return time;
		} catch (error) {
			this.logger.error(`Failed to get TTL for key ${key}:`, error);
			throw error;
		}
	}

	async delByPattern(pattern: string): Promise<void> {
		const keys = await this.client.keys(pattern);
		if (keys.length > 0) {
			await this.client.del(...keys);
			this.logger.debug(`Deleted ${keys.length} keys matching ${pattern}`);
		}
	}
}
