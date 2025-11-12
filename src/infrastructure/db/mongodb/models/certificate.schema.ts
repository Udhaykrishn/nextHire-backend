import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type CertificateDocument = HydratedDocument<Certificate>;

@Schema({ timestamps: true })
export class Certificate {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    certificateName: string;

    @Prop()
    issuingOrganization: string;

    @Prop()
    issueDate: Date;

    @Prop()
    expirationDate: Date;

    @Prop()
    certificateUrl: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);