export interface IExecutable<Input, Output> {
	execute(data: Input): Promise<Output>;
}
