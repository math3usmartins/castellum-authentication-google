const fs = require("fs")

const { signup } = require("./api/signup")

const express = require("../node_modules/express")

const port = process.env.PORT

const app = express()

app.listen(port, () => {
	console.log(`Demo app up & running...`)
})

app.post("/api/signup", (request, response) => {
	signup(request, response)
})

app.get("/index.html", (request, response) => {
	fs.readFile(__dirname + "/web/index.html", (err, content) => {
		const headers = {
			"Content-Type": "text/html",
		}

		response.writeHead(200, headers)
		response.end(
			content
				.toString()
				.replaceAll("${GOOGLE_CLIENT_ID}", process.env.GOOGLE_CLIENT_ID)
				.replaceAll("$GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID),
		)
	})
})

app.get("/jwt-decode.js", (request, response) => {
	fs.readFile(__dirname + "/web/jwt-decode.js", (err, content) => {
		const headers = {
			"Content-Type": "application/javascript",
		}

		response.writeHead(200, headers)
		response.end(content.toString())
	})
})
