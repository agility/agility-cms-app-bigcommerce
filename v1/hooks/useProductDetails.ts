import useSWR from "swr"
import useGraphQLToken from "./useGraphQLToken"
import useStoreInfo from "./useStoreInfo"

interface Props {
	store: string
	token: string
	entityID?: number
}


export default function useProductDetails({ store, token, entityID }: Props) {

	const { gqlToken } = useGraphQLToken({ store, token: token })
	const { storeInfo } = useStoreInfo({ store, token: token })

	const { data, error, isLoading } = useSWR(`/api/get-product-detail-${store}-${gqlToken}-${storeInfo?.secure_url}-${entityID}`, async () => {

		if (!storeInfo || !gqlToken || !entityID) return null

		const res = await fetch("/api/get-product", {
			method: "POST",
			body: JSON.stringify({
				storeUrl: storeInfo.secure_url,
				token: gqlToken,
				entityID
			})
		})

		if (res.ok) {
			const data = await res.json()

			return data
		}

		throw new Error(`Could not get Product for entity ID ${entityID}`)

	})

	return {
		products: data,
		isLoading,
		error
	}

}