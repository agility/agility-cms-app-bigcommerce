
import { getGQLClient } from "@/lib/get-gql-client";
import { gql } from "@apollo/client";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {

	const post = await request.json()

	const storeUrl = post.storeUrl || ''
  const token = post.token || ''
  const entityId = post.entityId || ''

	const client = getGQLClient({ storeUrl, token })
	const { data } = await client.query({

		query: gql`{
   site {
    product(entityId: ${entityId}) {
      id
      entityId
      name
      plainTextDescription
      defaultImage {
        ...ImageFields
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
      images {
        edges {
          node {
            ...ImageFields
          }
        }
      }
      reviewSummary {
        summationOfRatings
        numberOfReviews
      }
      prices {
        price {
          ...MoneyFields
        }
        priceRange {
          min {
            ...MoneyFields
          }
          max {
            ...MoneyFields
          }
        }
        salePrice {
          ...MoneyFields
        }
        retailPrice {
          ...MoneyFields
        }
        saved {
          ...MoneyFields
        }
        bulkPricing {
          minimumQuantity
          maximumQuantity
          ... on BulkPricingFixedPriceDiscount {
            price
          }
          ... on BulkPricingPercentageDiscount {
            percentOff
          }
          ... on BulkPricingRelativePriceDiscount {
            priceAdjustment
          }
        }
      }
      brand {
        name
      }
    }
  }
}

fragment ImageFields on Image {
  url320wide: url(width: 320)
  url640wide: url(width: 640)
  url960wide: url(width: 960)
  url1280wide: url(width: 1280)
}

fragment MoneyFields on Money {
  value
  currencyCode
}
`})

  //cache the product for 5 minutes

  return NextResponse.json(data || { data: null }).headers.set('Cache-Control', 's-maxage=300');


}

