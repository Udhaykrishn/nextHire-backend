import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ timestamps: true })
export class Application {
	@Prop({ required: true, ref: "User" })
	userId: string;

	@Prop({ required: true, ref: "Job" })
	jobId: string;

	@Prop()
	status: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
export type ApplicationType = InferSchemaType<typeof ApplicationSchema> & { _id: string; createdAt: Date; updatedAt: Date };
