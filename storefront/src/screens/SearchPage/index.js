import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SearchItem from "./SearchItem";
import Pagination from "react-bootstrap/Pagination";
import { useGetProducts } from "../../api/products";
import { Spinner } from "react-bootstrap";

const SearchPage = () => {
  const { searchTerm } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const getMin = (a, b) => (a < b ? a : b);
  const getMax = (a, b) => (a < b ? b : a);

  const paginatedEvent = (pageNumber) => {
    if (pageNumber === 0) {
      searchParams.delete("currentPage");
      setSearchParams(searchParams);
    } else setSearchParams({ ["currentPage"]: pageNumber });
  };

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
              {paginationModel?.totalPages > 1 && (
                <Pagination>
                  <Pagination.First onClick={() => paginatedEvent(0)} />
                  <Pagination.Prev
                    onClick={() =>
                      paginatedEvent(getMax(paginationModel.currentPage - 1, 0))
                    }
                  />
                  {[...Array(paginationModel?.totalPages)].map((e, i) => {
                    return (
                      <Pagination.Item
                        key={i}
                        onClick={() => paginatedEvent(i)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    );
                  })}
                  <Pagination.Next
                    onClick={() =>
                      paginatedEvent(
                        getMin(
                          paginationModel?.currentPage + 1,
                          paginationModel?.totalPages - 1
                        )
                      )
                    }
                  />
                  <Pagination.Last
                    onClick={() =>
                      paginatedEvent(
                        paginationModel?.totalPages === 0
                          ? 0
                          : paginationModel?.totalPages - 1
                      )
                    }
                  />
                </Pagination>
              )}
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
