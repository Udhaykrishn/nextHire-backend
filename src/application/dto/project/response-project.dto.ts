import { Expose } from "class-transformer";

export class ResponseProjectDto {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	projectName: string;

	@Expose()
	description: string;

	@Expose()
	startDate: Date;

	@Expose()
	endDate: Date;

	@Expose()
	url: string;

	@Expose()
	createdAt: Date;
}
