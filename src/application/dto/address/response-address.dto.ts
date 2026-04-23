import { Expose } from "class-transformer";

export class ResponseAddressDto {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	line1: string;

	@Expose()
	line2: string;

	@Expose()
	city: string;

	@Expose()
	district: string;

	@Expose()
	state: string;

	@Expose()
	country: string;

	@Expose()
	pincode: string;

	@Expose()
	role: string;

	@Expose()
	createdAt: Date;
}
