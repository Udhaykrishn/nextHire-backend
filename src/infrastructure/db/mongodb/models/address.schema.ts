import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type AddressDocument = HydratedDocument<Address>;

@Schema({ timestamps: true })
export class Address {
	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	line1: string;

	@Prop()
	line2: string;

	@Prop({ required: true })
	city: string;

	@Prop({ required: true })
	district: string;

	@Prop({ required: true })
	state: string;

	@Prop({ required: true })
	country: string;

	@Prop({ required: true })
	pincode: string;

	@Prop({ required: true, enum: ["user", "company"] })
	role: "user" | "company";
}

export const AddressSchema = SchemaFactory.createForClass(Address);

export type AddressType = InferSchemaType<typeof AddressSchema> & {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
};
