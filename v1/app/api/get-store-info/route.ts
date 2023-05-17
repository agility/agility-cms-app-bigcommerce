
import { getBigCommerceClient } from "@/lib/bc-auth/auth";
import { QueryParams } from "@/types/QueryParams";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {

	const post = await request.json()

	const store = post.store || ''
	const token = post.token || ''

	const url = `https://api.bigcommerce.com/${store}/v2/store`

	const fetchRes = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-Auth-Token': token
		}
	})

	if (fetchRes.ok) {
		const res = await fetchRes.json()

		return NextResponse.json(res || {res: null})
	} else {
		throw new Error("Error getting store info")
	}

}

