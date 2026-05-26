import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IAiService } from "../interface/ai-service.interface";
import { ENV_KEYS } from "@/application/enums/keys.env";
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

@Injectable()
export class GroqAiService implements IAiService {
	constructor(private readonly _configService: ConfigService) { }

	async generateContent(prompt: string): Promise<string> {
		let apiKey = this._configService.get<string>(ENV_KEYS.GROQ_API_KEY);

		if (!apiKey) {
			try {
				const envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env')));
				apiKey = envConfig['GROQ_API_KEY'];
			} catch (e) {
				console.error("Failed to parse .env file manually:", e);
			}
		}

		if (!apiKey) {
			throw new Error("GROQ_API_KEY is not configured.");
		}

		const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "llama-3.1-8b-instant",
				messages: [
					{ role: "user", content: prompt }
				],
				temperature: 0.1,
				response_format: { type: "json_object" }
			})
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Groq API error: ${error}`);
		}

		const data = await response.json();
		return data.choices[0].message.content;
	}
}
