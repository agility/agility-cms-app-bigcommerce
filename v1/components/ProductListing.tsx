import useGraphQLToken from "@/hooks/useGraphQLToken"
import useProductListing from "@/hooks/useProductListing"
import useStoreInfo from "@/hooks/useStoreInfo"

interface Props {
	store: string
	access_token: string
	onSelectProduct: (product: any) => void
}

export default function ProductListing({ access_token, store, onSelectProduct }: Props) {

	const {gqlToken} = useGraphQLToken({store, token: access_token})
	const {storeInfo} = useStoreInfo({store, token: access_token})

	const {isLoading, error, products} = useProductListing({storeUrl: storeInfo?.secure_url, token: gqlToken})

	return (
		<div className="bg-white">
			<h2>Select A Product</h2>

			<div>Store: {storeInfo?.name}</div>
			<div>
				Token: <input type="text" value={gqlToken} readOnly />
			</div>

			{isLoading && <div>Loading...</div>}
			{error && <div>Error? {`${error}`}</div>}

			{products && (
				<div>
					Products:
					<ul className="space-y-2 p-2">
						{products?.site?.products?.edges?.map((product: any) => (
							<li key={product.node.entityId}>
								<button onClick={() => {
									onSelectProduct(product)
								}} className="w-full text-left flex justify-start gap-2 items-center rounded bg-gray-200 p-1">
									<div className="bg-white rounded w-10 h-10 flex-shrink-0">
										<img src={product.node.defaultImage.url} className="w-10 h-10 rounded" alt={product.node.name} />
									</div>
									<div>
										<div className="line-clamp-1">{product.node.name}</div>
										<div className="text-sm text-gray-500 line-clamp-1">{product.node.plainTextDescription}</div>
									</div>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)

}