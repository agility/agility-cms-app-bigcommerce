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



		//PROD
		const url = `https://login.bigcommerce.com/app/${clientID}/install?state=${state}`
		console.log("URL", url)

		window.location.href = url
		// https://login.bigcommerce.com/app/dx0h58xiqvqon8atmr8rm4qlpbk5rv6/install
	}, [])

	return <div>Connect to BigCommerce</div>
}
