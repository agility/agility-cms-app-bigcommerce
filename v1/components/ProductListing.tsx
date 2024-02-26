/* eslint-disable @next/next/no-img-element */
import useGraphQLToken from "@/hooks/useGraphQLToken";
import useProductListing from "@/hooks/useProductListing";
import useStoreInfo from "@/hooks/useStoreInfo";
import { Button, FormInputWithAddons } from "@agility/plenum-ui";
import { useCallback, useState } from "react";
import { debounce } from "underscore";
import Loader from "./Loader";
import ProductRow from "./ProductRow";
import { Product } from "@/types/Product";

interface Props {
  store: string;
  access_token: string;
  onSelectProduct: (product: Product) => void;
}

export default function ProductListing({
  access_token,
  store,
  onSelectProduct,
}: Props) {
  const { gqlToken } = useGraphQLToken({ store, token: access_token });
  const { storeInfo } = useStoreInfo({ store, token: access_token });

  const [cursor, setCursor] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [filterValueBounced, setfilterValueBounced] = useState<string>("");

  const setfilterValueAndDebounce = (val: string) => {
    setFilter(val);
    debouncefilterValue(val);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncefilterValue = useCallback(
    //handle the search change - use debounce to limit how many times per second this is called
    debounce((value: string) => {
      //clear out the pagination cursor
      setCursor("");

      //set the filter
      setfilterValueBounced(value.toLowerCase());
    }, 250),
    []
  );

  const { isLoading, error, products } = useProductListing({
    storeUrl: storeInfo?.secure_url,
    token: gqlToken,
    search: filterValueBounced,
    cursor,
  });

  const s: Map<number, string> = new Map();

  const totalItems = products?.collectionInfo?.totalItems;
  const pageSize = products?.edges?.length ?? 0;
  const nextPageCursor = products?.pageInfo?.endCursor;

  const [pages, setPages] = useState<any[]>([{ row: 0, cursor: "" }]);
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className=" flex flex-col h-full">
      <div className="flex items-center gap-2">
        <div className="p-1 flex-1">
          <FormInputWithAddons
            placeholder="Search"
            type="search"
            value={filter}
            handleChange={(str: string) =>
              setfilterValueAndDebounce(str.trim())
            }
          />
        </div>
        <div className="text-gray-500 text-sm">
          Showing {pages[currentPage].row + 1} to{" "}
          {pages[currentPage].row + pageSize} of {totalItems ?? "?"} products
        </div>
        <div className="p-1 flex gap-2">
          <Button
            actionType="alternative"
            title="Previous Page"
            label=""
            icon="ChevronLeftIcon"
            disabled={pages.length < 2}
            onClick={() => {
              const prevPageCursor = pages[currentPage - 1]?.cursor || "";
              const newPages = pages.slice(0, -1);

              setCurrentPage(currentPage - 1);
              setPages(newPages);
              setCursor(prevPageCursor);
            }}
          />

          <Button
            actionType="alternative"
            title="Next Page"
            icon="ChevronRightIcon"
            label=""
            disabled={pages[currentPage].row + pageSize >= totalItems}
            onClick={() => {
              pages.push({
                row: pages[currentPage].row + pageSize,
                cursor: nextPageCursor,
              });
              setCurrentPage(currentPage + 1);
              setPages(pages);
              setCursor(nextPageCursor);
            }}
          />
        </div>
      </div>
      {isLoading && (
        <div className="flex flex-col flex-1 h-full justify-center items-center min-h-0">
          <div className="flex gap-2 items-center text-gray-500">
            <Loader className="!h-6 !w-6 " />
            <div>Loading...</div>
          </div>
        </div>
      )}
      {error && <div>Error? {`${error}`}</div>}
      {!isLoading && !error && products && (
        <div className="min-h-0 flex-1 py-4">
          <div className="scroll-black h-full overflow-y-auto">
            <ul className="space-y-2 p-2 ">
              {products?.edges?.map((product: any) => (
                <li key={product.node.entityId}>
                  <ProductRow
                    node={product.node}
                    product={{
                      id: product.node.id,
                      path: product.node.path,
                      sku: product.node.sku,
                      entityId: product.node.entityId,
                      image: {
                        listingUrl: product.node.defaultImage.url100wide,
                        detailUrl: product.node.defaultImage.url640wide,
                      },
                      name: product.node.name,
                      description: product.node.plainTextDescription,
                    }}
                    onSelectProduct={onSelectProduct}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
