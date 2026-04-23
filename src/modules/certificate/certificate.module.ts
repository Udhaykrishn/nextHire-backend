import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Certificate, CertificateSchema } from "@/infrastructure/db/mongodb/models/certificate.schema";
import { CertificateRepository } from "@/infrastructure/db/mongodb/repository/certificate.repository";
import { CreateCertificateUseCase } from "@/application/use-case/certificate/create-certificate.use-case";
import { GetCertificatesUseCase } from "@/application/use-case/certificate/get-certificates.use-case";
import { UpdateCertificateUseCase } from "@/application/use-case/certificate/update-certificate.use-case";
import { DeleteCertificateUseCase } from "@/application/use-case/certificate/delete-certificate.use-case";
import { CertificateController } from "@/presentation/controller/certificate/certificate.controller";
import { CERTIFICATE_TOKEN } from "@/application/enums/tokens/certificate-token.enum";
import { CERTIFICATE_MAPPER } from "@/application/enums";
import { CertificatePresistanceMapper } from "@/infrastructure/mappers/certificate-presistance.mapper";
import { CertificateApplicationMapper } from "@/application/mappers/certificate-application.mapper";

@Module({
	imports: [MongooseModule.forFeature([{ name: Certificate.name, schema: CertificateSchema }])],
	controllers: [CertificateController],
	providers: [
		{
			provide: CERTIFICATE_TOKEN.CERTIFICATE_REPOSITORY,
			useClass: CertificateRepository,
		},
		{
			provide: CERTIFICATE_MAPPER.CERTIFICATE_PERSISTANCE,
			useClass: CertificatePresistanceMapper,
		},
		{
			provide: CERTIFICATE_MAPPER.CERTIFICATE_APPLICATION,
			useClass: CertificateApplicationMapper,
		},
		{
			provide: CERTIFICATE_TOKEN.CREATE_CERTIFICATE_USE_CASE,
			useClass: CreateCertificateUseCase,
		},
		{
			provide: CERTIFICATE_TOKEN.GET_CERTIFICATES_USE_CASE,
			useClass: GetCertificatesUseCase,
		},
		{
			provide: CERTIFICATE_TOKEN.UPDATE_CERTIFICATE_USE_CASE,
			useClass: UpdateCertificateUseCase,
		},
		{
			provide: CERTIFICATE_TOKEN.DELETE_CERTIFICATE_USE_CASE,
			useClass: DeleteCertificateUseCase,
		},
	],
	exports: [CERTIFICATE_TOKEN.CERTIFICATE_REPOSITORY],
})
export class CertificateModule {}
