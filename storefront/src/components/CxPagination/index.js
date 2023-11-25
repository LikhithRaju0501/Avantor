import React from "react";
import Pagination from "react-bootstrap/Pagination";
import { useSearchParams } from "react-router-dom";

const CxPagination = ({ paginationModel }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getMin = (a, b) => (a < b ? a : b);
  const getMax = (a, b) => (a < b ? b : a);
  const paginatedEvent = (pageNumber) => {
    if (pageNumber === 0) {
      searchParams.delete("currentPage");
      setSearchParams(searchParams);
    } else setSearchParams({ ["currentPage"]: pageNumber });
  };
  return (
    paginationModel?.totalPages > 1 && (
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
              active={i === paginationModel?.currentPage}
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
    )
  );
};

export default CxPagination;
