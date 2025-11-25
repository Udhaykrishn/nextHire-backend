import {
    RECRUITER_MAPPER,
    RECRUITER_TOKEN,
} from "@/application/enums/recruiter";
import { RecruiterApplicationMapper } from "@/application/mappers/recruiter-application.mapper";
import { Recruiter, Recruiterschema } from "@/infrastructure/db/mongodb/models";
import { RecruiterRepository } from "@/infrastructure/db/mongodb/repository/recruiter.repository";
import { RecruiterPresitanceMapper } from "@/infrastructure/mappers/recruiter-presistance.mapper";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Recruiter.name, schema: Recruiterschema },
        ]),
    ],
    providers: [
        {
            provide: RECRUITER_MAPPER.RECRUITER_APPLICATION,
            useClass: RecruiterApplicationMapper,
        },
        {
            provide: RECRUITER_MAPPER.RECRUITER_PRESISTANCE,
            useClass: RecruiterPresitanceMapper,
        },
        {
            provide: RECRUITER_TOKEN.RECRUITER_REPOSITORY,
            useClass: RecruiterRepository,
        },
    ],
    exports: [
        MongooseModule,
        RECRUITER_TOKEN.RECRUITER_REPOSITORY,
        RECRUITER_MAPPER.RECRUITER_PRESISTANCE,
        RECRUITER_MAPPER.RECRUITER_APPLICATION,
    ],
})
export class RecruiterLiteModule {}
