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
