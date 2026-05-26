export interface IPdfParserService {
	parsePdfFromBuffer(buffer: Buffer): Promise<string>;
}
