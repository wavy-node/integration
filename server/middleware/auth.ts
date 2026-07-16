import { IWebhookBody, validateSignature } from "@wavynode/utils";
import { defineHandler, getHeader, getMethod, readBody, HTTPError } from "h3";

export default defineHandler(async e => {
	const path = new URL(e.req.url!).pathname

	if (getMethod(e) !== 'GET' && getMethod(e) !== 'POST') {
		throw new HTTPError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
	}

	const hmacHeader = getHeader(e, 'x-wavynode-hmac')
	if (!hmacHeader) throw new HTTPError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Signature missing' })

	const timestamp = getHeader(e, 'x-wavynode-timestamp')
	if (!timestamp) throw new HTTPError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Timestamp missing' })

	let body = {}
	if (getMethod(e) === 'POST') {
		body = await readBody<IWebhookBody>(e)
	}

	const isValid = validateSignature({
		method: getMethod(e),
		path,
		body,
		timestamp: parseInt(timestamp),
		secret: process.env.SECRET,
		timeTolerance: 300_000,
		signature: hmacHeader,
	})

	if (!isValid) throw new HTTPError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Invalid signature' })
})
