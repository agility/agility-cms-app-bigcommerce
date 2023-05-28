/* eslint-disable @next/next/no-img-element */
"use client"

import ProductListing from "@/components/ProductListing"
import useGraphQLToken from "@/hooks/useGraphQLToken"
import useProductListing from "@/hooks/useProductListing"
import useStoreInfo from "@/hooks/useStoreInfo"
import {Product} from "@/types/Product"
import {useAgilityAppSDK, closeModal, setHeight} from "@agility/app-sdk"
import {Button} from "@agility/plenum-ui"
import {useEffect, useState} from "react"
import useSWR from "swr"

export default function SelectBigCommerceProduct() {
	const {initializing, appInstallContext} = useAgilityAppSDK()

	const access_token = appInstallContext?.configuration?.access_token || ""
	const store = `stores/${appInstallContext?.configuration?.store}`

	if (initializing) {
		return null
	}

	//TODO: pull the store and access_token from the appInstallContext
	return (
		<div className="h-full flex flex-col">
			<div className="flex-1">
				<ProductListing
					store={store}
					access_token={access_token}
					onSelectProduct={(gqlProduct) => {
						const product: Product = {
							id: gqlProduct.node.id,
							path: gqlProduct.node.path,
							sku: gqlProduct.node.sku,
							entityId: gqlProduct.node.entityId,
							imageUrl: gqlProduct.node.defaultImage.url,
							name: gqlProduct.node.name,
							description: gqlProduct.node.plainTextDescription,
						}
						closeModal(product)
					}}
				/>
			</div>
			<div>
				<Button
					label="OK"
					onClick={() => {
						closeModal(null)
						console.log("OK")
					}}
				/>
			</div>
		</div>
	)
}
