import { IInflictedLaw } from "./inflicted-law.type"
import { IToken } from "./token.type"

export interface IPayload {
	id: number,
	projectId: number,
	chainId: number,
	address: {
		id: number,
		address: string,
		description: string
	},
	txHash: string,
	timestamp: string,
	amount: {
		value: number,
		usd: number,
	},
	token: IToken,
	inflictedLaws: IInflictedLaw[],
}

interface INotification {
	type: 'notification',
	data: IPayload
}
interface IError {
	type: 'error',
	data: string
}

export type IWebhookBody = INotification | IError
