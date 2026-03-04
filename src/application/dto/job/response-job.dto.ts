import { Expose } from "class-transformer";

export class ResponseJobDto {
	@Expose()
	id: string;

	@Expose()
	job_title: string;

	@Expose()
	job_description: string;

	@Expose()
	created_at: string;

	@Expose()
	status: string;

	// Add other fields as needed
}
