import { Injectable, NotFoundException } from "@nestjs/common";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class DeleteTemplateUseCase implements IExecutable<string, boolean> {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(id: string): Promise<boolean> {
		const existing = await this._templateRepository.findById(id);
		if (!existing) {
			throw new NotFoundException("Template not found");
		}
		return this._templateRepository.deleteById(id);
	}
}
