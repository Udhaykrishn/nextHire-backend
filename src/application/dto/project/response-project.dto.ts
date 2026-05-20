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
	githubUrls: { name: string; url: string }[];

	@Expose()
	isCollaborative: boolean;

	@Expose()
	skillsLearned: string[];

	@Expose()
	createdAt: Date;

	@Expose()
	company: string;

	@Expose()
	location: string;

	@Expose()
	industry: string;

	@Expose()
	role: string;

	@Expose()
	currentlyWorking: boolean;

	@Expose()
	employmentType: string;

	@Expose()
	noticePeriod: string;
}
