"use client"
import {useEffect} from "react"

export default function ConnectBigCommerce() {
	useEffect(() => {
		const clientID = process.env.NEXT_PUBLIC_BIGCOMMERCE_CLIENT_ID
		const callbackUrl = process.env.NEXT_PUBLIC_AUTH_CALLBACK

		//TODO: pull the state...
		const params = window.location.search

		let state = ""

		if (params) {
			console.log("PARAMS", params)

			const urlParams = new URLSearchParams(params)
			state = urlParams.get("state") || ""
		}

		//const url = `https://login.bigcommerce.com/oauth2/authorize?client_id=${clientID}&redirect_uri=${callbackUrl}&response_type=code&scope=store_v2_products_read_only,store_storefront_api&state=${state}&context`
		const url = `https://login.bigcommerce.com/app/${clientID}/install?state=${state}`
		console.log("URL", url)

		window.location.href = url
		// https://login.bigcommerce.com/app/dx0h58xiqvqon8atmr8rm4qlpbk5rv6/install


	}, [])

	return <div>Connect to BigCommerce</div>
}
