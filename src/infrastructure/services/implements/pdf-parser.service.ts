import { Injectable } from "@nestjs/common";
import type { IPdfParserService } from "../interface/pdf-parser-service.interface";
import pdfParse from "pdf-parse";

@Injectable()
export class PdfParserService implements IPdfParserService {
	async parsePdfFromBuffer(buffer: Buffer): Promise<string> {
		try {
			const pdfData = await pdfParse(buffer);
			return pdfData.text || "";
		} catch (error) {
			console.error("Error parsing PDF:", error);
			throw new Error("Failed to parse PDF document.");
		}
	}
}
