import { IUserData } from "@wavynode/utils";
import { eventHandler, getRouterParam } from "h3";

// give wavynode access to your user's data
export default eventHandler(async e => {
	const userId = getRouterParam(e, 'userId')

	const user: IUserData = await getUser(userId)

	return user
})

/**
	* Mock function for demonstration purposes 
*/
const getUser = async (_userId: string): Promise<IUserData> => {
	return new Promise((resolve, _reject) => {
		// mock call to db
		resolve({
			name: 'Julio César Chávez',
			rfc: 'CHCJ990712ABC'
		})
	})
}
