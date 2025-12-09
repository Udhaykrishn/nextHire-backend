import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
	@Prop({ required: true, unique: true, index: true })
	email: string;

	@Prop({ required: true })
	password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
export type AdminType = InferSchemaType<typeof AdminSchema> & {
	_id: string;
	createdAt: Date;
};
