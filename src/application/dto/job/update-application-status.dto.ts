import { IsEnum, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { APPLICATION_STATUS } from "@/domain/entity/job-application.entity";

export class UpdateApplicationStatusDto {
	@IsOptional()
	@IsString()
	applicationId: string;

	@IsNotEmpty()
	@IsEnum(APPLICATION_STATUS)
	status: APPLICATION_STATUS;
}
