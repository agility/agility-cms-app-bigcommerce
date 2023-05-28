
import { getGQLClient } from "@/lib/get-gql-client";
import { gql } from "@apollo/client";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

	const storeUrl = `${request.query.storeUrl}`
	const token = (request.headers.authorization || '').replace('Bearer ', '')

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
            url(width:300)
        }
        }
      }
    }
  }
}
`})

	//cache the product listing for this query for 5 minutes
	response.setHeader('Cache-Control', 's-maxage=300')
	return response.status(200).json(data || { data: null })


}

