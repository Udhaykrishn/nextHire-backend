import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { UpdateFormDto } from "@/application/dto/form/update-form.dto";
import { GetAllFormsUseCase } from "@/application/use-case/form/get-all-forms.use-case";
import { GetFormByKeyUseCase } from "@/application/use-case/form/get-form-by-key.use-case";
import { UpdateFormUseCase } from "@/application/use-case/form/update-form.use-case";
import { USER_ROLE } from "@/domain/enums";
import { Roles } from "@/presentation/decorators";
import { AuthGuard, RoleGuard } from "@/presentation/guards";

@Controller("forms")
export class FormController {
	constructor(
		private readonly _getAllFormsUseCase: GetAllFormsUseCase,
		private readonly _getFormByKeyUseCase: GetFormByKeyUseCase,
		private readonly _updateFormUseCase: UpdateFormUseCase,
	) {}

	@Get()
	@UseGuards(AuthGuard, RoleGuard)
	@Roles(USER_ROLE.ADMIN)
	async getAllForms() {
		return await this._getAllFormsUseCase.execute();
	}

	@Get(":key")
	async getFormByKey(@Param("key") key: string) {
		return await this._getFormByKeyUseCase.execute(key);
	}

	@Put(":key")
	@UseGuards(AuthGuard, RoleGuard)
	@Roles(USER_ROLE.ADMIN)
	async updateForm(@Param("key") key: string, @Body() dto: UpdateFormDto) {
		return await this._updateFormUseCase.execute({ formKey: key, data: dto });
	}
}
