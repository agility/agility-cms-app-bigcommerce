"use client"
import EmptySection from "@/components/EmptySection"
import useProductDetails from "@/hooks/useProductDetails"
import {Product} from "@/types/Product"
import {
	useAgilityAppSDK,
	contentItemMethods,
	setHeight,
	openModal,
	useElementHeight,
	assetsMethods,
	setVisibility,
} from "@agility/app-sdk"
import {Button, ButtonDropDown} from "@agility/plenum-ui"
import {IconBarcode, IconBuildingStore, IconChevronDown, IconFileBarcode} from "@tabler/icons-react"
import {useEffect, useRef, useState} from "react"

export default function ChooseProductField() {
	const containerRef = useRef<HTMLIFrameElement>(null)
	const {initializing, appInstallContext, locale, field, instance, contentItem} = useAgilityAppSDK()

	const access_token = appInstallContext?.configuration?.access_token || ""
	const store = `stores/${appInstallContext?.configuration?.store}`

	const [selectedProduct, onsetSelectedProduct] = useState<Product | null | undefined>(null)

	const {} = useProductDetails({store, token: access_token, entityID: selectedProduct?.entityId})

	const setSelectedProduct = (product: Product | null | undefined) => {
		const productJSON = product ? JSON.stringify(product) : ""
		contentItemMethods.setFieldValue({name: field?.name, value: productJSON})
		onsetSelectedProduct(product)
	}

	const selectProduct = () => {
		openModal<Product | null>({
			title: "Select a Product",
			name: "select-bigcommerce-product",
			props: {
				selectedProductID: 1,
			},
			callback: (product: Product | null | undefined) => {
				setSelectedProduct(product)
			},
		})
	}

	useEffect(() => {
		//initialize the field value of the product
		if (!field || !contentItem) return

		let product: Product | null = null
		const productJSON = contentItem.values[field.name]
		try {
			if (productJSON) product = JSON.parse(productJSON)
		} catch (e) {
			console.log("Error parsing product JSON.", e)
		}

		onsetSelectedProduct(product)
	}, [contentItem, field])

	useEffect(() => {
		//set the height of the field
		if (!containerRef.current) return
		const mdeSizeElm = document.querySelector<HTMLElement>("#product-field")
		if (!mdeSizeElm) return
		const observer = new ResizeObserver((entries) => {
			const entry = entries[0]
			if (entry) setHeight({height: entry.contentRect.height})
		})
		observer.observe(mdeSizeElm)

		return () => {
			if (observer) observer.disconnect()
		}
	}, [initializing])

	useEffect(() => {
		//load the product details if we have a product
		if (!selectedProduct) return
	}, [selectedProduct])

	if (initializing) return null

	return (
		<div ref={containerRef} id="product-field" className="bg-white">
			{selectedProduct && (
				<div className="flex">
					<div className="">
						<img src={selectedProduct.imageUrl} className="h-72 w-64 rounded" alt={selectedProduct.name} />
					</div>
					<div className="flex-1 flex">
						<div className="flex-1">
							<div className="text-lg font-bold">
								{selectedProduct.name} {selectedProduct.entityId}
							</div>
							<div className="text-sm text-gray-500">{selectedProduct.description}</div>
						</div>

						<div className="flex justify-end p-1 mb-2">
							<div>
								<ButtonDropDown
									button={{
										type: "secondary",
										size: "base",
										label: "Browse",
										icon: "CollectionIcon",
										onClick: () => selectProduct(),
									}}
									dropDown={{
										items: [
											[
												{
													label: "Remove Product",
													icon: "TrashIcon",
													onClick: () => {
														setSelectedProduct(null)
													},
												},
											],
										],
										IconElement: () => <IconChevronDown />,
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{!selectedProduct && (
				<EmptySection
					icon={<IconBuildingStore className="text-gray-400 h-12 w-12" stroke={1} />}
					messageHeading="No Product Selected"
					messageBody="Select a product to attach it to this item."
					buttonComponent={<Button type="alternative" onClick={() => selectProduct()} label="Browse Products" />}
				/>
			)}
		</div>
	)
}
