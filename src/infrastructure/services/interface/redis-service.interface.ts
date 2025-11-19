export interface IRedisService {
	set(key: string, value: string, expirySeconds?: number): Promise<void>;
	get(key: string): Promise<string | null>;
	del(key: string): Promise<void>;
	delByPattern(pattern: string): Promise<void>;
	ttl(key: string): Promise<number>;
}
