import { RecruiterController } from "@/presentation/controller/recruiter";
import { Module } from "@nestjs/common";
import { RecruiterCrudModule } from "./recruiter-crud.module";

@Module({
	imports: [RecruiterCrudModule],
	controllers: [RecruiterController],
	exports: [],
})
export class RecruiterModule {}
