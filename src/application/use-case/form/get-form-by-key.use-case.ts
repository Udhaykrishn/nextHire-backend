import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IFormRepository } from "@/application/interface/repository/form-repository.interface";
import type { FormConfigEntity } from "@/domain/entity/form-config.entity";

@Injectable()
export class GetFormByKeyUseCase implements IExecutable<string, FormConfigEntity> {
	constructor(
		@Inject("FORM_REPOSITORY")
		private readonly _formRepository: IFormRepository,
	) {}

	async execute(formKey: string): Promise<FormConfigEntity> {
		const form = await this._formRepository.findByKey(formKey);
		if (!form) {
			throw new NotFoundException(`Form "${formKey}" not found`);
		}
		return form;
	}
}
