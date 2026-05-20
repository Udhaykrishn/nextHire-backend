import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import type { IUuidService } from "../interface/uuid-service.interface";

@Injectable()
export class UuidService implements IUuidService {
	generate(): string {
		return uuidv4();
	}
}
