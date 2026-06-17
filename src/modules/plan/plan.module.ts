import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlanDocument, PlanSchema } from "@/infrastructure/db/mongodb/models/plan.schema";
import { PlanRepository } from "@/infrastructure/db/mongodb/repository/plan.repository";
import { CreatePlanUseCase } from "@/application/use-case/plan/create-plan.use-case";
import { UpdatePlanUseCase } from "@/application/use-case/plan/update-plan.use-case";
import { DeletePlanUseCase } from "@/application/use-case/plan/delete-plan.use-case";
import { GetAllPlansUseCase } from "@/application/use-case/plan/get-all-plans.use-case";
import { GetPlanByIdUseCase } from "@/application/use-case/plan/get-plan-by-id.use-case";
import { PlanController } from "@/presentation/controller/plan/plan.controller";

@Module({
	imports: [MongooseModule.forFeature([{ name: PlanDocument.name, schema: PlanSchema }])],
	controllers: [PlanController],
	providers: [
		{
			provide: "PLAN_REPOSITORY",
			useClass: PlanRepository,
		},
		CreatePlanUseCase,
		UpdatePlanUseCase,
		DeletePlanUseCase,
		GetAllPlansUseCase,
		GetPlanByIdUseCase,
	],
	exports: ["PLAN_REPOSITORY"],
})
export class PlanModule {}
