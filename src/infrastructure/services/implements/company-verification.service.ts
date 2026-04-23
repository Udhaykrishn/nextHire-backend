import { Injectable } from "@nestjs/common";
import { ICompanyVerificationService } from "@/application/interface/services/company-verification-service.interface";

@Injectable()
export class CompanyVerificationService implements ICompanyVerificationService {
	async verifyGSTIN(gstin: string): Promise<boolean> {
		// GSTIN Regex for India: 2 numbers, 5 letters, 4 numbers, 1 letter, 1 alphanumeric, 1 Z, 1 alphanumeric
		const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

		if (!gstinRegex.test(gstin)) {
			return false;
		}

		/* 
		try {
			const apiUrl = process.env.GSTIN_API_URL || 'https://api.example.com/verify-gstin';
			const apiKey = process.env.GSTIN_API_KEY;

			const response = await fetch(`${apiUrl}/${gstin}`, {
				headers: {
					'Authorization': `Bearer ${apiKey}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				return false;
			}

			const data = await response.json();
			return data.isValid; // Adjust based on actual API response
		} catch (error) {
			console.error('GSTIN Verification Failed:', error);
			// Fallback to regex validation or fail safe?
			// Depending on requirement, we might return false if API fails.
			return false;
		}
		*/

		return true;
	}

	async verifyCIN(cin: string): Promise<boolean> {
		if (!cin || cin.length !== 21) {
			return false;
		}

		// CIN Structure (Strict Positional Matching):
		// 1. Listing Status: [LU] (1 char)
		// 2. Industry Code: [0-9]{5} (5 digits)
		// 3. State Code: [A-Z]{2} (2 letters)
		// 4. Year: [0-9]{4} (4 digits)
		// 5. Company Type: [A-Z]{3} (3 letters)
		// 6. Reg Number: [0-9]{6} (6 digits)
		const cinRegex = /^([LUu]{1})([0-9]{5})([A-Z|a-z]{2})([0-9]{4})([A-Z|a-z]{3})([0-9]{6})$/;

		const match = cin.match(cinRegex);
		if (!match) {
			return false;
		}

		// Exact positional extraction
		const _listingStatus = match[1].toUpperCase();
		const _nicCode = match[2];
		const stateCode = match[3].toUpperCase();
		const year = match[4];
		const companyType = match[5].toUpperCase();
		const _regNo = match[6];

		const validStateCodes = [
			"AN",
			"AP",
			"AR",
			"AS",
			"BR",
			"CH",
			"CT",
			"DN",
			"DD",
			"DL",
			"GA",
			"GJ",
			"HR",
			"HP",
			"JK",
			"JH",
			"KA",
			"KL",
			"LA",
			"LD",
			"MP",
			"MH",
			"MN",
			"ML",
			"MZ",
			"NL",
			"OR",
			"PY",
			"PB",
			"RJ",
			"SK",
			"TN",
			"TG",
			"TR",
			"UP",
			"UT",
			"WB",
		];
		if (!validStateCodes.includes(stateCode.toUpperCase())) {
			return false;
		}

		const currentYear = new Date().getFullYear();
		const incorporationYear = Number.parseInt(year, 10);
		if (incorporationYear < 1850 || incorporationYear > currentYear) {
			return false;
		}

		const validCompanyTypes = ["PLC", "PTC", "OPC", "GOI", "SGC", "GLL", "FLC", "FTC", "NPL", "GAP", "UPL"];
		if (!validCompanyTypes.includes(companyType.toUpperCase())) {
			return false;
		}

		/**
		 * TODO: Integrate with the actual external API.
		 * The user mentioned "we have that api for that".
		 * Please replace the URL and Logic below with the specific API details.
		 */

		/* 
        try {
            const apiUrl = process.env.GSTIN_API_URL || 'https://api.example.com/verify-gstin';
            const apiKey = process.env.GSTIN_API_KEY;

            const response = await fetch(`${apiUrl}/${gstin}`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.isValid; // Adjust based on actual API response
        } catch (error) {
            console.error('GSTIN Verification Failed:', error);
            // Fallback to regex validation or fail safe?
            // Depending on requirement, we might return false if API fails.
            return false;
        }
        */

		// For now, assuming API check passes if Regex passes (until API is configured)
		return true;
	}
}
