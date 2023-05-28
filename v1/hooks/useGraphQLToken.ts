import useSWR from "swr"

interface Props {
	store: string
	token: string
}

const getGraphQLToken = async ({ store, token }: Props) => {
	if (!store || !token) return null
	const res = await fetch(`/api/get-gql-token?store=${encodeURIComponent(store)}`, {
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
	throw new Error("Could not get GraphQL Token")
}

export default function useGraphQLToken({ store, token }: Props) {

	const { data, error, isLoading } = useSWR(`/api/get-gql-token-${token}-${store}`,
		() => getGraphQLToken({ store, token }),
		{
			revalidateOnFocus: false,
		})

	return {
		gqlToken: data,
		isLoading,
		error
	}

}