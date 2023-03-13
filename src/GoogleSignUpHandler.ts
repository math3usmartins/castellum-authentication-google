import type { IdTokenValidator } from "./IdTokenValidator"
import type { SignUpHandler } from "@castellum/authentication/dist/SignUp/SignUpHandler"
import { AccountAlreadyActivated } from "@castellum/authentication/dist/SignUp/Error/AccountAlreadyActivated"
import type { AccountId } from "@castellum/authentication/dist/Account/AccountId"
import type { AccountUsername } from "@castellum/authentication/dist/Account/AccountUsername"

export class GoogleSignUpHandler {
	public constructor(
		private readonly idTokenValidator: IdTokenValidator,
		private readonly builtInHandler: SignUpHandler,
	) {}

	public async signup(email: AccountUsername, token: string, timestamp: number): Promise<AccountId> {
		await this.idTokenValidator.validate(token, email.value)

		const signUpResponse = await this.builtInHandler.signup(email, timestamp)

		return await this.builtInHandler
			.activate(signUpResponse.accountId, timestamp, signUpResponse.token.value)
			.then(() => signUpResponse.accountId)
			.catch(async (err) =>
				err instanceof AccountAlreadyActivated ? signUpResponse.accountId : await Promise.reject(err),
			)
	}
}
