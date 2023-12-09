import React from "react";
import { useGetOrders } from "../../api/orders";
import { CxPagination, CxSpinner } from "../../components";
import OrderItems from "./OrderItems";
import { useSearchParams } from "react-router-dom";
import { Form, Table } from "react-bootstrap";

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams?.get("currentPage")) || 0;
  const sort = searchParams?.get("sort") || "createdAt-desc";
  const orderedDate = searchParams?.get("orderedDate") || "";
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrders(
    currentPage,
    sort,
    orderedDate
  );

  let paginationModel = {
    pageSize: 0,
    totalResults: 0,
    currentPage,
    totalPages: 0,
  };

  const defaultFacetId = (type) =>
    ordersData?.data?.facets
      ?.find((facet) => facet?.type === type)
      ?.values?.find((option) => option?.selected)?.id || "";

  if (!isOrdersLoading) {
    paginationModel = { currentPage, ...ordersData?.data?.pagination };
  }

  const onFacetChange = (event, type) => {
    const facetId = event?.target?.value;
    const params = new URLSearchParams(searchParams);
    params?.delete("currentPage");
    if (type === "sorts") {
      if (facetId === "createdAt-desc") {
        searchParams?.delete("sort");
        setSearchParams(searchParams);
      } else {
        params?.set("sort", facetId);
        setSearchParams(params?.toString());
      }
    } else if (type === "dateRange") {
      if (facetId === "all") {
        searchParams?.delete("orderedDate");
        setSearchParams(searchParams);
      } else {
        params?.set("orderedDate", facetId);
        setSearchParams(params?.toString());
      }
    }
  };

  const onActiveFilterClicked = (filter) => {
    searchParams?.delete(filter);
    searchParams?.delete("currentPage");
    setSearchParams(searchParams);
  };

  return isOrdersLoading ? (
    <CxSpinner />
  ) : (
    <div className="p-4">
      <div className="d-flex">
        <div style={{ flexBasis: "25%" }}>
          <div
            style={{
              padding: "10px",
            }}
          >
            <h3>Filter/Sort by :</h3>
            <h5 className="mt-3">Active Filters:</h5>
            <div className="mb-3">
              <div className="p-2">
                {ordersData?.data?.breadcrumbs?.map(
                  ({ id, type, title, isDefault }) => {
                    return isDefault ? (
                      <div
                        key={id}
                        style={{ backgroundColor: "#f1f2f6" }}
                        className="mb-2 p-2"
                      >
                        <a
                          className="cx-link"
                          style={{ textDecoration: "none" }}
                        >
                          {title}
                        </a>
                      </div>
                    ) : (
                      <div
                        key={id}
                        style={{ backgroundColor: "#f1f2f6" }}
                        className="mb-2 p-2"
                      >
                        <a
                          className="cx-link"
                          style={{ textDecoration: "none", cursor: "pointer" }}
                          onClick={() => onActiveFilterClicked(type)}
                        >
                          <div className="d-flex justify-content-between">
                            <div>{title}</div>
                            <div>x</div>
                          </div>
                        </a>
                      </div>
                    );
                  }
                )}
              </div>
              <hr />
            </div>
            {ordersData?.data?.facets?.map(({ type, values }) => {
              return (
                <Form.Select
                  key={type}
                  value={defaultFacetId(type)}
                  onChange={() => onFacetChange(event, type)}
                  style={{ cursor: "pointer" }}
                  className="mt-3 mb-3"
                >
                  {values?.map((option) => (
                    <option key={option?.id} value={option?.id}>
                      {option?.title}
                    </option>
                  ))}
                </Form.Select>
              );
            })}
          </div>
        </div>
        <div style={{ flexBasis: "75%" }}>
          <div
            style={{
              padding: "10px",
              maxWidth: "1000px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h2>Order History</h2>
            <div>
              <span className="fw-bold text-break">Note: </span>
              <span className="text-break">
                It might take time for us to deliver the Order Confirmation mail
                for orders that you placed recently (if any).
              </span>
            </div>
            {ordersData?.data?.orders?.length ? (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Order#</th>
                    <th> Date Placed</th>
                    <th>Number of Items</th>
                    <th>Order Status</th>
                    <th>Price</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersData?.data?.orders?.map((order) => {
                    return <OrderItems key={order?._id} order={order} />;
                  })}
                </tbody>
              </Table>
            ) : (
              <div className="p-2">No Orders Found.</div>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <CxPagination paginationModel={paginationModel} />
      </div>
    </div>
  );
};

export default OrdersPage;
