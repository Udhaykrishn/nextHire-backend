import {
	Global,
	Module,
	type OnModuleInit,
	type OnModuleDestroy,
} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({})
export class MongoDbModule implements OnModuleInit, OnModuleDestroy {
	static forRootAsync() {
		return {
			module: MongoDbModule,
			imports: [
				MongooseModule.forRootAsync({
					useFactory: (config: ConfigService) => ({
						uri: config.get<string>("MONGODB_URI"),
						dbName:"nextHire"
					}),
					inject: [ConfigService],
				}),
			],
		};
	}
	onModuleInit() {
		console.log("mongodb is connected");
	}

	onModuleDestroy() {
		console.log("mongodb is destoryed");
	}
}
