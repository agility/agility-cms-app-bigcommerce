import useSWR from "swr"

interface Props {
	store: string
	token: string
}


export default function useStoreInfo({ store, token }: Props) {

	const { data, error, isLoading } = useSWR(`/api/get-store-info-${token}-${store}`, async () => {
		const res = await fetch("/api/get-store-info", {
			method: "POST",
			body: JSON.stringify({
				store,
				token
			})
		})

		if (res.ok) {
			const data = await res.json()
			return data
		}
		throw new Error("Could not get Store Info")

	}, {
		revalidateOnFocus: false,
	})

	return {
		storeInfo: data,
		isLoading,
		error
	}

}