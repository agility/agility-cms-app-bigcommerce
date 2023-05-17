import useSWR from "swr"

interface Props {
	store: string
	token: string
}

const getGraphQLToken = async ({ store, token }: Props) => {

	const res = await fetch("/api/get-graphql-token", {
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
	throw new Error("Could not get GraphQL Token")
}

export default function useGraphQLToken({ store, token }: Props) {

	const { data, error, isLoading } = useSWR(`/api/get-graphql-token-${token}-${store}`,
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