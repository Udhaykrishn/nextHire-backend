import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

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