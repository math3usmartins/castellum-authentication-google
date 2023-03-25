import type { OAuth2Client } from "google-auth-library"
import type { IdTokenValidator } from "../IdTokenValidator"
import { BadTokenError } from "./Error/BadTokenError"

export class GoogleAuthValidator implements IdTokenValidator {
	constructor(private readonly clientId: string, private readonly client: OAuth2Client) {}

	public async validate(token: string, email: string): Promise<void> {
		const ticket = await this.client
			.verifyIdToken({ idToken: token, audience: this.clientId })
			.catch(async () => await Promise.reject(new BadTokenError()))

		const payload = ticket.getPayload()

		if (payload === undefined || payload.email === undefined || payload.email !== email) {
			await Promise.reject(new BadTokenError())
		}
	}
}
