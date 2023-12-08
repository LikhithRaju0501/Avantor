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

  const defaultSortId =
    ordersData?.data?.sorts?.find((option) => option?.selected)?.id || "";
  const defaultDateId =
    ordersData?.data?.dateRange?.find((option) => option?.selected)?.id || "";

  if (!isOrdersLoading) {
    paginationModel = { currentPage, ...ordersData?.data?.pagination };
  }

  const onSortChange = (event) => {
    const sortId = event?.target?.value;
    const params = new URLSearchParams(searchParams);
    if (sortId === "createdAt-desc") {
      searchParams?.delete("sort");
      setSearchParams(searchParams);
    } else {
      params?.set("sort", sortId);
      setSearchParams(params?.toString());
    }
  };

  const onDateRangeChange = (event) => {
    const dateId = event?.target?.value;
    const params = new URLSearchParams(searchParams);
    if (dateId === "all") {
      searchParams?.delete("orderedDate");
      setSearchParams(searchParams);
    } else {
      params?.set("orderedDate", dateId);
      setSearchParams(params?.toString());
    }
  };

  const onActiveFilterClicked = (filter) => {
    searchParams?.delete(filter);
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
            <Form.Select
              value={defaultSortId}
              onChange={onSortChange}
              style={{ cursor: "pointer" }}
            >
              {ordersData?.data?.sorts?.map((option) => (
                <option key={option?.id} value={option?.id}>
                  {option?.title}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={defaultDateId}
              onChange={onDateRangeChange}
              style={{ cursor: "pointer", margin: "10px 0 10px 0" }}
            >
              {ordersData?.data?.dateRange?.map((option) => (
                <option key={option?.id} value={option?.id}>
                  {option?.title}
                </option>
              ))}
            </Form.Select>
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
