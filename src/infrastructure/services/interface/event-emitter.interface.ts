export interface IEventEmitter {
	emit(event: string | symbol, ...values: unknown[]): boolean;
}
