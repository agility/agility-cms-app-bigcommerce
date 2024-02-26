/* eslint-disable @next/next/no-img-element */
"use client";

import ProductListing from "@/components/ProductListing";
import useGraphQLToken from "@/hooks/useGraphQLToken";
import useProductListing from "@/hooks/useProductListing";
import useStoreInfo from "@/hooks/useStoreInfo";
import { Product } from "@/types/Product";
import { useAgilityAppSDK, closeModal, setHeight } from "@agility/app-sdk";
import { Button } from "@agility/plenum-ui";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function SelectBigCommerceProduct() {
  const { initializing, appInstallContext } = useAgilityAppSDK();

  const access_token = appInstallContext?.configuration?.accessToken || "";
  const store = `stores/${appInstallContext?.configuration?.storeHash}`;

  if (initializing) {
    return null;
  }

  //TODO: pull the store and access_token from the appInstallContext
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ProductListing
          store={store}
          access_token={access_token}
          onSelectProduct={(product) => {
            closeModal(product);
          }}
        />
      </div>
      <div className="flex justify-end p-1">
        <Button
          actionType="alternative"
          label="Cancel"
          className="w-24"
          onClick={() => {
            closeModal(null);
          }}
        />
      </div>
    </div>
  );
}
