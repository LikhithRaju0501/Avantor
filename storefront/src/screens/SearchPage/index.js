import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SearchItem from "./SearchItem";
import { useGetProducts } from "../../api/products";
import { Spinner } from "react-bootstrap";
import { PaginationCMS } from "../../components";

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
    <div>
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>
            {paginationModel?.totalResults} results for {searchTerm}
          </h2>
          <div className="d-flex">
            <section style={{ flexBasis: "30%" }}>
              <h3>Facets</h3>
            </section>
            <div>
              <PaginationCMS
                paginationModel={paginationModel}
                paginatedEvent={(event) => paginatedEvent(event)}
              />
              {data?.data?.entries.length === 0 ? (
                <h2>No Results for this term</h2>
              ) : (
                data?.data?.entries.map((entry) => {
                  return (
                    <SearchItem
                      key={entry._id}
                      productId={entry._id}
                      product={entry.product}
                      description={entry.description}
                      supplierName={entry.supplier.supplierName}
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
