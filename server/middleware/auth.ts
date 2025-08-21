import { validateSignature } from "@wavynode/utils";
import { createError, eventHandler, getHeader, readBody } from "h3";
import { IWebhookBody } from "~~/types/webhook-body.type";

export default eventHandler(async e => {
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

	const timestamp = getHeader(e, 'x-wavynode-timestmap')
	if (!timestamp) throw createError({
		status: 400,
		statusMessage: 'Bad Request',
		message: 'Timestamp missing'
	})

	const body = await readBody<IWebhookBody>(e).catch(() => ({}))

	const isValid = validateSignature({
		method: e.method,
		path,
		body,
		timestamp: parseInt(timestamp),
		secret: process.env.SECRET,
		timeTolerance: 300_000,
		signature: hmacHeader
	})

	if (!isValid) throw createError({
		status: 401,
		statusMessage: 'Unauthorized',
		message: 'Invalid signature'
	})
})
