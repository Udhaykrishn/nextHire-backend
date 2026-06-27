import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { UpdateFormDto } from "@/application/dto/form/update-form.dto";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IFormRepository } from "@/application/interface/repository/form-repository.interface";
import type { FormConfigEntity } from "@/domain/entity/form-config.entity";

interface UpdateFormInput {
	formKey: string;
	data: UpdateFormDto;
}

@Injectable()
export class UpdateFormUseCase implements IExecutable<UpdateFormInput, FormConfigEntity> {
	constructor(
		@Inject("FORM_REPOSITORY")
		private readonly _formRepository: IFormRepository,
	) {}

	async execute({ formKey, data }: UpdateFormInput): Promise<FormConfigEntity> {
		const form = await this._formRepository.findByKey(formKey);
		if (!form) {
			throw new NotFoundException(`Form "${formKey}" not found`);
		}

		form.updateFields(data.fields);

		const updated = await this._formRepository.updateByKey(formKey, form);
		if (!updated) {
			throw new NotFoundException(`Form "${formKey}" not found`);
		}
		return updated;
	}
}
