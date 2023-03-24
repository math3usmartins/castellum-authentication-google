import type { IdTokenValidator } from "./IdTokenValidator"
import type { AccountId } from "@castellum/authentication/dist/Account/AccountId"
import type { AccountRepository } from "@castellum/authentication/dist/Account/AccountRepository"
import type { AccountUsername } from "@castellum/authentication/dist/Account/AccountUsername"

export class GoogleVerifyIdHandler {
	public constructor(
		private readonly idTokenValidator: IdTokenValidator,
		private readonly repository: AccountRepository,
	) {}

	public async verify(email: AccountUsername, token: string): Promise<AccountId> {
		await this.idTokenValidator.validate(token, email.value)

		const account = await this.repository.getByUsername(email)

		return account.id
	}
}
