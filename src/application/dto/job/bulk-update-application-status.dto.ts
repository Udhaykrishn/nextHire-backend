import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { APPLICATION_STATUS } from "@/domain/entity/job-application.entity";

export class BulkUpdateApplicationStatusDto {
	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	applicationIds: string[];

	@IsNotEmpty()
	@IsEnum(APPLICATION_STATUS)
	status: APPLICATION_STATUS;
}
