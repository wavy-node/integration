import { IWebhookBody, validateSignature } from "@wavynode/utils";
import { createError, eventHandler, getHeader, readBody } from "h3";

export default eventHandler(async e => {
	console.log('Hello from auth')
	const [path, _] = e.path.split('?')

	// this template only accepts GET and POST requests 
	if (e.method != 'GET' && e.method != 'POST') throw createError({
		status: 405,
		statusMessage: 'Method Not Allowed',
	})

	// read body
	const hmacHeader = getHeader(e, 'x-wavynode-hmac')
	if (!hmacHeader) throw createError({
		status: 401,
		statusMessage: 'Unauthorized',
		message: 'Signature missing'
	})

	console.log({ hmacHeader })

	const timestamp = getHeader(e, 'x-wavynode-timestmap')
	if (!timestamp) throw createError({
		status: 400,
		statusMessage: 'Bad Request',
		message: 'Timestamp missing'
	})

	console.log({ timestamp })

	const body = await readBody<IWebhookBody>(e)

	console.log({ body })

	const isValid = validateSignature({
		method: e.method,
		path,
		body: body || {},
		timestamp: parseInt(timestamp),
		secret: process.env.SECRET,
		timeTolerance: 300_000,
		signature: hmacHeader
	})

	console.log({ isValid })

	if (!isValid) throw createError({
		status: 401,
		statusMessage: 'Unauthorized',
		message: 'Invalid signature'
	})
})
