import type { IdTokenValidator } from "../IdTokenValidator"
import { BadTokenError } from "./Error/BadTokenError"

export class InMemoryValidator implements IdTokenValidator {
	constructor(private readonly token: string, private readonly email: string) {}

	async validate(token: string, email: string): Promise<void> {
		this.token === token && this.email === email
			? await Promise.resolve()
			: await Promise.reject(new BadTokenError())
	}
}
