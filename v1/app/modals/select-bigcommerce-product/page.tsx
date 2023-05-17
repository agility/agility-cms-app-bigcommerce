/* eslint-disable @next/next/no-img-element */
"use client"

import ProductListing from "@/components/product-listing"
import useGraphQLToken from "@/hooks/useGraphQLToken"
import useProductListing from "@/hooks/useProductListing"
import useStoreInfo from "@/hooks/useStoreInfo"
import {useAgilityAppSDK} from "@agility/app-sdk"
import {useEffect, useState} from "react"
import useSWR from "swr"

export default function SelectBigCommerceProduct() {
	const {initializing, appInstallContext} = useAgilityAppSDK()

	if (initializing) {
		return <div>Initializing...</div>
	}

	//TODO: pull the store and access_token from the appInstallContext
	return <div>{ JSON.stringify(appInstallContext) }</div>

	//return <ProductListing store={auth?.context} access_token={auth.access_token} />
}
