import assert from "assert"
import "mocha"

import { InMemoryGenerator } from "@castellum/authentication/dist/SignUp/Token/Generator/InMemoryGenerator"
import { InMemoryRepository } from "@castellum/authentication/dist/Account/Repository/InMemoryRepository"
import { InMemoryValidator } from "./IdTokenValidator/InMemoryValidator"
import { AccountUsername } from "@castellum/authentication/dist/Account/AccountUsername"
import { GoogleVerifyIdHandler } from "./GoogleVerifyIdHandler"
import { BadTokenError } from "./IdTokenValidator/Error/BadTokenError"

class GoogleVerifyIdHandlerTestContext {
	public readonly tokenGenerator: InMemoryGenerator
	public readonly repository: InMemoryRepository
	public readonly idTokenValidator: InMemoryValidator
	public readonly handler: GoogleVerifyIdHandler

	public constructor(email: string, token: string) {
		this.tokenGenerator = new InMemoryGenerator(30, [])
		this.repository = new InMemoryRepository(this.tokenGenerator, [])
		this.idTokenValidator = new InMemoryValidator(token, email)
		this.handler = new GoogleVerifyIdHandler(this.idTokenValidator, this.repository)
	}
}

describe("GoogleVerifyIdHandler", () => {
	const username = new AccountUsername("someone@gmail.com")
	const token = "abc123xyz098"
	const timestamp = 1678660707
	const anotherUsername = new AccountUsername("someone-else@gmail.com")

	it("must return account ID when token is valid", async () => {
		const { handler, repository } = new GoogleVerifyIdHandlerTestContext(username.value, token)

		const account = await repository.create(username, timestamp)
		await repository.create(anotherUsername, timestamp)

		const accountId = await handler.verify(username, token)

		assert.equal(accountId, account.id)
		assert.equal(accountId.value, "user-1")
	})

	it("must reject when token is invalid", async () => {
		const { handler, repository } = new GoogleVerifyIdHandlerTestContext(username.value, "bad-token")
		await repository.create(username, timestamp)

		const failed = await handler
			.verify(username, token)
			.then(() => false)
			.catch((err) => err instanceof BadTokenError)

		assert.equal(failed, true)
	})

	it("must reject when account is invalid", async () => {
		const { handler, repository } = new GoogleVerifyIdHandlerTestContext("another-user-name", token)
		await repository.create(username, timestamp)

		const failed = await handler
			.verify(username, token)
			.then(() => false)
			.catch((err) => err instanceof BadTokenError)

		assert.equal(failed, true)
	})
})
