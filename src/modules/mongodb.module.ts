import {
	Global,
	Module,
	type DynamicModule,
	type OnModuleInit,
	type OnModuleDestroy,
} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
@Global()
@Module({})
export class MongoDbModule implements OnModuleInit, OnModuleDestroy {
	onModuleInit() {
		console.log("mongodb is connected");
	}

	onModuleDestroy() {
		console.log("mongodb is destoryed");
	}
	static forRootAsync(): DynamicModule {
		return {
			module: MongoDbModule,
			imports: [
				MongooseModule.forRootAsync({
					useFactory: (config: ConfigService) => ({
						uri: config.get<string>("MONGODB_URI"),
					}),
					inject: [ConfigService],
				}),
			],
		};
	}
}
