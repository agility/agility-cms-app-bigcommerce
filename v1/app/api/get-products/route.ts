
import { getGQLClient } from "@/lib/get-gql-client";
import { gql } from "@apollo/client";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {

	const post = await request.json()

	const storeUrl = post.storeUrl || ''
	const token = post.token || ''

	const client = getGQLClient({ storeUrl, token })
	const { data } = await client.query({

		query: gql`{
  site {
    products {
      pageInfo {
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          entityId
			 id
          sku
          name
          name
          plainTextDescription
          path
        defaultImage {
            url(width:100)
        }
        }
      }
    }
  }
}
`})

	return NextResponse.json(data || { data: null })


}

