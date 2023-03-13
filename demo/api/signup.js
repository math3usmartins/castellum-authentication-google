const { SignUpHandler } = require("@castellum/authentication/dist/SignUp/SignUpHandler")
const { InMemoryGenerator } = require("@castellum/authentication/dist/SignUp/Token/Generator/InMemoryGenerator")
const { TokenValidator } = require("@castellum/authentication/dist/SignUp/TokenValidator")
const { InMemoryRepository } = require("@castellum/authentication/dist/Account/Repository/InMemoryRepository")
const { AccountUsername } = require("@castellum/authentication/dist/Account/AccountUsername")

const { GoogleSignUpHandler } = require("../../dist/GoogleSignUpHandler")
const { GoogleAuthValidator } = require("../../dist/IdTokenValidator/GoogleAuthValidator")
const { OAuth2Client } = require("google-auth-library")

const headers = {
	"Content-Type": "application/json",
}

exports.signup = function signup(request, response) {
	let body = []

	request.on("data", (chunk) => {
		body.push(chunk)
	})

	request.on("end", async () => {
		const handler = new GoogleSignUpHandler(
			new GoogleAuthValidator(process.env.GOOGLE_CLIENT_ID, new OAuth2Client(process.env.GOOGLE_CLIENT_ID)),
			new SignUpHandler(new TokenValidator(), new InMemoryRepository(new InMemoryGenerator(300, []), [])),
		)

		let payload = {}

		try {
			payload = JSON.parse(Buffer.concat(body).toString())
		} catch (err) {
			console.error(err)

			response.writeHead(400, headers)
			response.end(JSON.stringify("Bad Request"))

			return
		}

		handler
			.signup(new AccountUsername(payload.email), payload.token, new Date().getTime() / 1000)
			.then((accountId) => {
				response.writeHead(200, headers)
				response.end(JSON.stringify({ accountId: accountId.value }))
			})
			.catch((err) => {
				console.error(err)

				response.writeHead(400, headers)
				response.end(JSON.stringify("Bad Request"))
			})
	})
}
