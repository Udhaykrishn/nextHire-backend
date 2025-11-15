export interface IPasswordHash {
	compare(password: string, plain: string): Promise<boolean>;
	hash(password: string): Promise<string>;
}
