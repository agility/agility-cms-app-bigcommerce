import useSWR from "swr"

interface Props {
	storeUrl: string
	token: string
	search: string
	cursor: string
}


export default function useProductListing({ storeUrl, token, search, cursor }: Props) {

	const { data, error, isLoading } = useSWR(`/api/get-products-${token}-${storeUrl}-${search}-${cursor}`, async () => {

		if (!storeUrl || !token) return null

		const res = await fetch(`/api/get-products?storeUrl=${encodeURIComponent(storeUrl)}&search=${encodeURIComponent(search)}&cursor=${encodeURIComponent(cursor)}`, {
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})

		if (res.ok) {
			const data = await res.json()

			return data?.site?.search?.searchProducts?.products || {}
		}

		throw new Error("Could not get Products")

	})

	return {
		products: data,
		isLoading,
		error
	}

}