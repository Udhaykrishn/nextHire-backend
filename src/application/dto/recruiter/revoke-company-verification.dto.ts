import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class RevokeCompanyVerificationDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(5)
	reason: string;
}
