import { getBigCommerceClient } from "@/lib/bc-auth/auth";
import { QueryParams } from "@/types/QueryParams";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

	 const { searchParams } = new URL(request.url);

	// const { AUTH_CALLBACK, BIGCOMMERCE_CLIENT_ID, BIGCOMMERCE_CLIENT_SECRET } = process.env;
	// console.log("BIGCOMMERCE_CLIENT_ID", process.env.BIGCOMMERCE_CLIENT_ID)
	// const tokenRes = await fetch(`https://login.bigcommerce.com/oauth2/token`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Accept': 'application/json',
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify({

	// 		"client_id":  BIGCOMMERCE_CLIENT_ID ,
	// 		"client_secret": BIGCOMMERCE_CLIENT_SECRET,
	// 		"code": searchParams.get('code') || '',
	// 		"scope": searchParams.get('scope') || '',
	// 		"grant_type": "authorization_code",
	// 		"redirect_uri": AUTH_CALLBACK
	// 	})
	// });

	// if (tokenRes.ok) {
	// 	const token = await tokenRes.json()

	// 	console.log("token", token)

	// } else {

	// 	const error = await tokenRes.json()
	// 	console.log("ERROR", error)

	// }


	const params: QueryParams = {
		account_uuid: searchParams.get('account_uuid') || '',
		code: searchParams.get('code') || '',
		scope: searchParams.get('scope') || ''
	}

	console.log("params", params)

	const bigcommerce = getBigCommerceClient()
	const session = await bigcommerce.authorize(params)
	// const contextString = session?.context ?? session?.sub
	// const context = contextString.split('/')[1] || '';

	console.log("session", session)

	return NextResponse.json({})
}