export interface IAiService {
	generateContent(prompt: string): Promise<string>;
}
