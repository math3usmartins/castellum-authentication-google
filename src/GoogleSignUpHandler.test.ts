import assert from "assert"
import "mocha"

import { InMemoryGenerator } from "@castellum/authentication/dist/SignUp/Token/Generator/InMemoryGenerator"
import { TokenValidator } from "@castellum/authentication/dist/SignUp/TokenValidator"
import { InMemoryRepository } from "@castellum/authentication/dist/Account/Repository/InMemoryRepository"
import { SignUpHandler } from "@castellum/authentication/dist/SignUp/SignUpHandler"
import { GoogleSignUpHandler } from "./GoogleSignUpHandler"
import { InMemoryValidator } from "./IdTokenValidator/InMemoryValidator"
import { AccountUsername } from "@castellum/authentication/dist/Account/AccountUsername"

class GoogleSignUpHandlerTestContext {
	public readonly tokenGenerator: InMemoryGenerator
	public readonly repository: InMemoryRepository
	public readonly idTokenValidator: InMemoryValidator
	public readonly handler: GoogleSignUpHandler

	public constructor(email: string, token: string) {
		this.tokenGenerator = new InMemoryGenerator(30, [])
		this.repository = new InMemoryRepository(this.tokenGenerator, [])
		this.idTokenValidator = new InMemoryValidator(token, email)
		this.handler = new GoogleSignUpHandler(
			this.idTokenValidator,
			new SignUpHandler(new TokenValidator(), this.repository),
		)
	}
}

describe("GoogleSignUpHandler", () => {
	const email = new AccountUsername("someone@gmail.com")
	const token = "abc123xyz098"
	const timestamp = 1678660707

	it("must create & activate account", async () => {
		const { handler, repository } = new GoogleSignUpHandlerTestContext(email.value, token)

		const accountId = await handler.signup(email, token, timestamp)
		assert.equal(accountId.value, "user-1")

		const account = await repository.getById(accountId)
		assert.equal(account.isActive(), true)
	})

	it("must be idempotent", async () => {
		const { handler } = new GoogleSignUpHandlerTestContext(email.value, token)

		let accountId = await handler.signup(email, token, timestamp)
		assert.equal(accountId.value, "user-1")

		accountId = await handler.signup(email, token, timestamp)
		assert.equal(accountId.value, "user-1")
	})
})
