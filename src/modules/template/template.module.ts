import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
	InterviewerTemplate,
	InterviewerTemplateSchema,
} from "@/infrastructure/db/mongodb/models/interviewer-template.schema";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";
import { InterviewerTemplatePersistenceMapper } from "@/infrastructure/mappers/interviewer-template-persistence.mapper";

import { CreateTemplateUseCase } from "@/application/use-case/template/create-template.use-case";
import { ListTemplatesUseCase } from "@/application/use-case/template/list-templates.use-case";
import { UpdateTemplateUseCase } from "@/application/use-case/template/update-template.use-case";
import { DeleteTemplateUseCase } from "@/application/use-case/template/delete-template.use-case";

import { RecruiterTemplateController } from "@/presentation/controller/template/recruiter-template.controller";

@Module({
	imports: [MongooseModule.forFeature([{ name: InterviewerTemplate.name, schema: InterviewerTemplateSchema }])],
	controllers: [RecruiterTemplateController],
	providers: [
		InterviewerTemplatePersistenceMapper,
		InterviewerTemplateRepository,
		CreateTemplateUseCase,
		ListTemplatesUseCase,
		UpdateTemplateUseCase,
		DeleteTemplateUseCase,
	],
	exports: [InterviewerTemplateRepository],
})
export class TemplateModule {}
