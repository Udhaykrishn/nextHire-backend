import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import type { IEventEmitter } from "../interface/event-emitter.interface";

@Injectable()
export class EventEmitterService implements IEventEmitter {
	constructor(private readonly eventEmitter: EventEmitter2) {}

	emit(event: string | symbol, ...values: unknown[]): boolean {
		return this.eventEmitter.emit(event, ...values);
	}
}
