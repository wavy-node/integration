import { createError, eventHandler, getHeader, readBody } from "h3";
import { IWebhookBody } from "~~/types/webhook-body.type";
import { createHmacSignature } from "~~/util/hmac";

// todo: verify GET requests
export default eventHandler(async e => {
	// read body
	const hmacHeader = getHeader(e, 'x-wavynode-hmac')
	if (!hmacHeader) throw createError({
		status: 401,
		statusMessage: 'Unauthorized',
		message: 'Signature missing'
	})

	const body = await readBody<IWebhookBody>(e).catch(() => null)
	if (!body) throw createError({ status: 400, message: 'No body provided' })

	// assert it's a request from wavynode using our secret
	const signature = createHmacSignature(JSON.stringify(body), process.env.SECRET)
	if (signature !== hmacHeader) throw createError({
		status: 401,
		statusMessage: 'Unauthorized',
		message: 'Invalid signature'
	})
})
