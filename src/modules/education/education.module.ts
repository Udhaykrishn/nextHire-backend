import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Education, EducationSchema } from "@/infrastructure/db/mongodb/models/education.schema";
import { EducationRepository } from "@/infrastructure/db/mongodb/repository/education.repository";
import { CreateEducationUseCase } from "@/application/use-case/education/create-education.use-case";
import { GetEducationsUseCase } from "@/application/use-case/education/get-educations.use-case";
import { UpdateEducationUseCase } from "@/application/use-case/education/update-education.use-case";
import { DeleteEducationUseCase } from "@/application/use-case/education/delete-education.use-case";
import { EducationController } from "@/presentation/controller/education/education.controller";
import { EDUCATION_TOKEN } from "@/application/enums/tokens/education-token.enum";
import { EDUCATION_MAPPER } from "@/application/enums";
import { EducationPresistanceMapper } from "@/infrastructure/mappers/education-presistance.mapper";
import { EducationApplicationMapper } from "@/application/mappers/education-application.mapper";

@Module({
	imports: [MongooseModule.forFeature([{ name: Education.name, schema: EducationSchema }])],
	controllers: [EducationController],
	providers: [
		{
			provide: EDUCATION_TOKEN.EDUCATION_REPOSITORY,
			useClass: EducationRepository,
		},
		{
			provide: EDUCATION_MAPPER.EDUCATION_PERSISTANCE,
			useClass: EducationPresistanceMapper,
		},
		{
			provide: EDUCATION_MAPPER.EDUCATION_APPLICATION,
			useClass: EducationApplicationMapper,
		},
		{
			provide: EDUCATION_TOKEN.CREATE_EDUCATION_USE_CASE,
			useClass: CreateEducationUseCase,
		},
		{
			provide: EDUCATION_TOKEN.GET_EDUCATIONS_USE_CASE,
			useClass: GetEducationsUseCase,
		},
		{
			provide: EDUCATION_TOKEN.UPDATE_EDUCATION_USE_CASE,
			useClass: UpdateEducationUseCase,
		},
		{
			provide: EDUCATION_TOKEN.DELETE_EDUCATION_USE_CASE,
			useClass: DeleteEducationUseCase,
		},
	],
	exports: [EDUCATION_TOKEN.EDUCATION_REPOSITORY],
})
export class EducationModule {}
