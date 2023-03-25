import assert from "assert"
import "mocha"

import { BadTokenError } from "./Error/BadTokenError"
import { GoogleAuthValidator } from "./GoogleAuthValidator"
import { OAuth2Client } from "google-auth-library"

const clientId = process.env["TEST_GOOGLE_CLIENT_ID"]
const token = process.env["TEST_GOOGLE_ID_TOKEN"]
const email = process.env["TEST_GOOGLE_ID_EMAIL"]

describe("GoogleAuthValidator", () => {
	it("must reject bad email address", async () => {
		if (clientId === undefined) {
			console.warn("SKIP: TEST_GOOGLE_CLIENT_ID env var is NOT SET.")

			return
		}

		if (token === undefined) {
			console.warn("SKIP: TEST_GOOGLE_ID_TOKEN env var is NOT SET")

			return
		}

		const validator = new GoogleAuthValidator(token, new OAuth2Client(clientId))

		const failed = await validator
			.validate(token, "castellum@gmail.com")
			.then(() => false)
			.catch((err) => err instanceof BadTokenError)

		assert.equal(failed, true)
	})

	it("must accept valid token & email address", async () => {
		if (clientId === undefined) {
			console.warn("SKIP: TEST_GOOGLE_CLIENT_ID env var is NOT SET.")

			return
		}

		if (token === undefined) {
			console.warn("SKIP: TEST_GOOGLE_ID_TOKEN env var is NOT SET")

			return
		}

		if (email === undefined) {
			console.warn("SKIP: TEST_GOOGLE_ID_EMAIL env var is NOT SET")

			return
		}

		const validator = new GoogleAuthValidator(clientId, new OAuth2Client(clientId))

		const failed = await validator
			.validate(token, email)
			.then(() => false)
			.catch(() => true)

		assert.equal(failed, false)
	})
})
