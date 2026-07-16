import { IWebhookBody } from "@wavynode/utils";
import { defineHandler, readBody, HTTPError } from "h3";

export default defineHandler(async e => {
	const body = await readBody<IWebhookBody>(e)
	if (!body) throw new HTTPError({ statusCode: 400, message: 'No body provided' })

	switch (body.type) {
		case 'notification':
			console.log({ payload: body.data })
			break

		case 'error':
			console.error(`${new Date().toISOString()}: [Error] ${body.data}`)
			break

		default:
			throw new HTTPError({ statusCode: 400, message: 'Invalid body format' })
	}

	return "Ok"
})
