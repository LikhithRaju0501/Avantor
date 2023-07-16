import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SearchItem from "./SearchItem";
import Pagination from "react-bootstrap/Pagination";

const SearchPage = () => {
  const { searchTerm } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const paginationModel = {
    pageSize: 10,
    totalResults: 157,
    currentPage: Number(searchParams?.get("currentPage")) || 0,
    totalPages: 16,
  };

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
      <h2 style={{ textAlign: "center" }}>157 results for {searchTerm} </h2>
      <div className="d-flex">
        <section style={{ flexBasis: "30%" }}>
          <h3>Facets</h3>
        </section>
        <div>
          <Pagination>
            <Pagination.First onClick={() => paginatedEvent(0)} />
            <Pagination.Prev
              onClick={() =>
                paginatedEvent(getMax(paginationModel.currentPage - 1, 0))
              }
            />
            {[...Array(paginationModel?.totalPages)].map((e, i) => {
              return (
                <Pagination.Item key={i} onClick={() => paginatedEvent(i)}>
                  {i + 1}
                </Pagination.Item>
              );
            })}
            <Pagination.Next
              onClick={() =>
                paginatedEvent(
                  getMin(
                    paginationModel?.currentPage + 1,
                    paginationModel?.totalPages
                  )
                )
              }
            />
            <Pagination.Last
              onClick={() => paginatedEvent(paginationModel?.totalPages)}
            />
          </Pagination>
          <SearchItem productId={"abcd1234"} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
