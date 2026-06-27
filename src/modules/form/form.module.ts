import { Module, type OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GetAllFormsUseCase } from "@/application/use-case/form/get-all-forms.use-case";
import { GetFormByKeyUseCase } from "@/application/use-case/form/get-form-by-key.use-case";
import { SeedDefaultFormsUseCase } from "@/application/use-case/form/seed-default-forms.use-case";
import { UpdateFormUseCase } from "@/application/use-case/form/update-form.use-case";
import { FormConfigDocument, FormConfigSchema } from "@/infrastructure/db/mongodb/models/form-config.schema";
import { FormConfigRepository } from "@/infrastructure/db/mongodb/repository/form-config.repository";
import { FormController } from "@/presentation/controller/form/form.controller";

@Module({
	imports: [MongooseModule.forFeature([{ name: FormConfigDocument.name, schema: FormConfigSchema }])],
	controllers: [FormController],
	providers: [
		{
			provide: "FORM_REPOSITORY",
			useClass: FormConfigRepository,
		},
		GetAllFormsUseCase,
		GetFormByKeyUseCase,
		UpdateFormUseCase,
		SeedDefaultFormsUseCase,
	],
	exports: ["FORM_REPOSITORY"],
})
export class FormModule implements OnModuleInit {
	constructor(private readonly _seedDefaultForms: SeedDefaultFormsUseCase) {}

	async onModuleInit(): Promise<void> {
		await this._seedDefaultForms.execute();
	}
}
