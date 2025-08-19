export interface IInflictedLaw {
	name: string,
	description: string,
	source?: string,
	risk: 'warn' | 'illegal',
	country: string,
	countryCode: string
}
