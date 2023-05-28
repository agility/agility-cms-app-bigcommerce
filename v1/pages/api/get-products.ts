
import { getGQLClient } from "@/lib/get-gql-client";
import { gql } from "@apollo/client";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

	const storeUrl = `${request.query.storeUrl}`
	const cursor = `${request.query.cursor}`
	const token = (request.headers.authorization || '').replace('Bearer ', '')
	const search = `${request.query.search || ''}`.replaceAll("\"", "")
	const client = getGQLClient({ storeUrl, token })

	const { data } = await client.query({

		query: gql`{
  site {
    search {
      searchProducts(filters: { searchTerm: "${search}" }) {
        products (first:10, after: "${cursor}"){
			 collectionInfo {
            totalItems
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
          edges {
				cursor
            node {
              entityId
              id
              sku
              name
              plainTextDescription
              path
				  defaultImage {
                url100wide: url(width: 100)
                url640wide: url(width: 640)
              }
              inventory {
                isInStock
                aggregated {
                  availableToSell
                  warningLevel
                }
              }
              availabilityV2 {
                status
                description
              }
				  prices {
                price {
                  currencyCode
                  value
                }
              }

            }
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

