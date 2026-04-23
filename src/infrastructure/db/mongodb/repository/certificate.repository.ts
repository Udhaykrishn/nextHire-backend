import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import type { CertificateEntity } from "@/domain/entity/certificate.entity";
import type { ICertificateRepository } from "@/application/interface/repository";
import { Certificate } from "../models";
import type { Model } from "mongoose";
import { CERTIFICATE_MAPPER } from "@/application/enums";
import type { ICertificatePresistanceMapper } from "@/application/interface/mappers/certificate/certificate-presistance.mapper";
import type { CertificateType } from "../models/certificate.schema";

@Injectable()
export class CertificateRepository
	extends BaseRepository<CertificateEntity, CertificateType>
	implements ICertificateRepository<CertificateEntity>
{
	constructor(
		@InjectModel(Certificate.name) private certificateModel: Model<CertificateType>,
		@Inject(CERTIFICATE_MAPPER.CERTIFICATE_PERSISTANCE)
		mapper: ICertificatePresistanceMapper<CertificateEntity, CertificateType>,
	) {
		super(certificateModel, mapper);
	}

	async findByUserId(userId: string): Promise<CertificateEntity[]> {
		const docs = await this.certificateModel.find({ userId });
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}
}
