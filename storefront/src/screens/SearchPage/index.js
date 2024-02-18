import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SearchItem from "./SearchItem";
import { useGetProducts } from "../../api/products";
import { CxSpinner, CxPagination } from "../../components";

const SearchPage = () => {
  const { searchTerm } = useParams();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams?.get("currentPage")) || 0;
  const { isLoading, data, isError, error } = useGetProducts(
    searchTerm,
    currentPage
  );
  let paginationModel = {
    pageSize: 0,
    totalResults: 0,
    currentPage,
    totalPages: 0,
  };

  if (!isLoading) {
    paginationModel = { currentPage, ...data?.data?.pagination };
  }

  return (
    <div id="SearchPage">
      {isLoading ? (
        <CxSpinner />
      ) : (
        <>
          <h2 className="text-center px-5">
            {paginationModel?.totalResults} results for {searchTerm}
          </h2>
          <div className="d-flex">
            <section style={{ flexBasis: "30%" }}>
              <h3>Facets</h3>
            </section>
            <div>
              <CxPagination paginationModel={paginationModel} />
              {data?.data?.entries.length === 0 ? (
                <h2>No Results for this term</h2>
              ) : (
                data?.data?.entries.map((entry) => {
                  return (
                    <SearchItem
                      key={entry._id}
                      productId={entry._id}
                      {...entry}
                    />
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
