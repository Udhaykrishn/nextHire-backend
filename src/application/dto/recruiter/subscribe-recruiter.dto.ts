import { IsNotEmpty, IsString } from "class-validator";

export class SubscribeRecruiterDto {
	@IsString()
	@IsNotEmpty()
	recruiterId: string;

	@IsString()
	@IsNotEmpty()
	plan: string;

	@IsString()
	@IsNotEmpty()
	transactionId: string;
}
