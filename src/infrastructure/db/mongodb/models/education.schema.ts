import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type EducationDocument = HydratedDocument<Education>;

@Schema({ timestamps: true })
export class Education {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    institutionName: string;

    @Prop()
    degree: string;

    @Prop()
    fieldOfStudy: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    gpa: string;
}

export const EducationSchema = SchemaFactory.createForClass(Education);