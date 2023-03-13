import assert from "assert"
import "mocha"

import { InMemoryValidator } from "./InMemoryValidator"
import { BadTokenError } from "./Error/BadTokenError"

describe("InMemoryValidator", () => {
	const email = "someone@gmail.com"
	const token = "abc123"

	it("must accept valid token & email pair", async () => {
		const validator = new InMemoryValidator(token, email)

		const failed = await validator
			.validate(token, email)
			.then(() => false)
			.catch((err) => err instanceof BadTokenError)

		assert.equal(failed, false)
	})

	it("must reject bad email", async () => {
		const validator = new InMemoryValidator(token, email)

		const failed = await validator
			.validate(token, "someone-else@gmail.com")
			.then(() => false)
			.catch((err) => err instanceof BadTokenError)

		assert.equal(failed, true)
	})

	it("must reject bad token", async () => {
		const validator = new InMemoryValidator(token, email)

		const failed = await validator
			.validate("xyz456", email)
			.then(() => false)
			.catch((err) => err instanceof BadTokenError)

		assert.equal(failed, true)
	})
})
