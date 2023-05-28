import useSWR from "swr"

interface Props {
	storeUrl: string
	token: string
}


export default function useProductListing({ storeUrl, token }: Props) {

	const { data, error, isLoading } = useSWR(`/api/get-products-${token}-${storeUrl}`, async () => {

		if (!storeUrl || !token) return null

		const res = await fetch(`/api/get-products?storeUrl=${encodeURIComponent(storeUrl)}`, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})

		if (res.ok) {
			const data = await res.json()

			return data
		}

		throw new Error("Could not get Products")

	})

	return {
		products: data,
		isLoading,
		error
	}

}