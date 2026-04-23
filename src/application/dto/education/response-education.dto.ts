import { Expose } from "class-transformer";

export class ResponseEducationDto {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	institutionName: string;

	@Expose()
	degree: string;

	@Expose()
	fieldOfStudy: string;

	@Expose()
	startDate: Date;

	@Expose()
	endDate: Date;

	@Expose()
	gpa: string;

	@Expose()
	createdAt: Date;
}
