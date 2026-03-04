import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UserSubscriptionDto {
	@IsString()
	@IsNotEmpty()
	current_plan: string;

	@IsBoolean()
	is_subscribed: boolean;
}

export class UserSubscriptionUpdateDto {
	@ValidateNested()
	@Type(() => UserSubscriptionDto)
	subscription: UserSubscriptionDto;
}
