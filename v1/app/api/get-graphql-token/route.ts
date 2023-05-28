
import { getBigCommerceClient } from "@/lib/bc-auth/auth";
import { QueryParams } from "@/types/QueryParams";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {

	const post = await request.json()

	const store = post.store || ''
	const token = post.token || ''

	const url = `https://api.bigcommerce.com/${store}/v3/storefront/api-token`

	const tokenRes = await fetch(url, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': token
		},
		body: JSON.stringify({
			"allowed_cors_origins": [

			],
			"channel_id": 1,
			"expires_at": 1885635176
		})
	})

	if (tokenRes.ok) {
		const token = await tokenRes.json()

		//cache the gql token for 24 hours
		return NextResponse
			.json(token?.data?.token || { token: null })
			.headers.set('Cache-Control', 's-maxage=86400');
	} else {
		throw new Error("Error creating token")
	}

}

