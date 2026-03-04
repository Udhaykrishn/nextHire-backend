import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Project, ProjectSchema } from "@/infrastructure/db/mongodb/models/project.schema";
import { ProjectRepository } from "@/infrastructure/db/mongodb/repository/project.repository";
import { CreateProjectUseCase } from "@/application/use-case/project/create-project.use-case";
import { GetProjectsUseCase } from "@/application/use-case/project/get-projects.use-case";
import { UpdateProjectUseCase } from "@/application/use-case/project/update-project.use-case";
import { DeleteProjectUseCase } from "@/application/use-case/project/delete-project.use-case";
import { ProjectController } from "@/presentation/controller/project/project.controller";
import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import { PROJECT_MAPPER } from "@/application/enums";
import { ProjectPresistanceMapper } from "@/infrastructure/mappers/project-presistance.mapper";
import { ProjectApplicationMapper } from "@/application/mappers/project-application.mapper";

@Module({
	imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
	controllers: [ProjectController],
	providers: [
		{
			provide: PROJECT_TOKEN.PROJECT_REPOSITORY,
			useClass: ProjectRepository,
		},
		{
			provide: PROJECT_MAPPER.PROJECT_PERSISTANCE,
			useClass: ProjectPresistanceMapper,
		},
		{
			provide: PROJECT_MAPPER.PROJECT_APPLICATION,
			useClass: ProjectApplicationMapper,
		},
		{
			provide: PROJECT_TOKEN.CREATE_PROJECT_USE_CASE,
			useClass: CreateProjectUseCase,
		},
		{
			provide: PROJECT_TOKEN.GET_PROJECTS_USE_CASE,
			useClass: GetProjectsUseCase,
		},
		{
			provide: PROJECT_TOKEN.UPDATE_PROJECT_USE_CASE,
			useClass: UpdateProjectUseCase,
		},
		{
			provide: PROJECT_TOKEN.DELETE_PROJECT_USE_CASE,
			useClass: DeleteProjectUseCase,
		},
	],
	exports: [PROJECT_TOKEN.PROJECT_REPOSITORY],
})
export class ProjectModule {}
