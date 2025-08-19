import { createHmac } from 'node:crypto'

/**
	* Creates a base64 hmac signature for the given message using the secret
*/
export const createHmacSignature = (message: string, secret?: string): string => {
	if (!secret) throw new Error('secret is not defined')

	const hmac = createHmac('sha256', secret)
	hmac.update(message)

	return hmac.digest('base64')
}

