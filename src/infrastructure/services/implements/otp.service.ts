import { Injectable } from "@nestjs/common";
import { IOtpService } from "../interface";
import crypto from "node:crypto";

@Injectable()
export class OtpService implements IOtpService {
	generate(length: number = 6): string {
		if (length < 1 || length > 10) {
			throw new Error("OTP length must be between 1 and 10 digits");
		}

		const min = 10 ** (length - 1);
		const max = 10 ** length - 1;
		const randomBytes = crypto.randomBytes(4);
		const randomNum = (randomBytes.readUInt32BE(0) % (max - min + 1)) + min;
		return randomNum.toString();
	}
}
