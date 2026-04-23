import { Global, Module, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "@/infrastructure/config";

@Global()
@Module({})
export class MongoDbModule implements OnModuleInit, OnModuleDestroy {
	static forRootAsync() {
		return {
			module: MongoDbModule,
			imports: [
				MongooseModule.forRootAsync({
					useFactory: (config: ConfigService<EnvConfig>) => {
						return {
							uri: config.get("MONGODB_URI"),
							dbName: "nextHire",
						};
					},
					inject: [ConfigService],
				}),
			],
		};
	}

	onModuleInit() {
		console.log("mongodb is connected");
	}

	onModuleDestroy() {
		console.log("mongodb is destroyed");
	}
}
