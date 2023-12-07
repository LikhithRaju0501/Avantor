import React from "react";
import { useGetOrders } from "../../api/orders";
import { CxPagination, CxSpinner } from "../../components";
import OrderItems from "./OrderItems";
import { useSearchParams } from "react-router-dom";
import { Form, Table } from "react-bootstrap";

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams?.get("currentPage")) || 0;
  const sort = searchParams?.get("sort") || "createdAt";
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrders(
    currentPage,
    sort
  );

  let paginationModel = {
    pageSize: 0,
    totalResults: 0,
    currentPage,
    totalPages: 0,
  };

  const defaultSelectedId =
    ordersData?.data?.sorts?.find((option) => option?.selected)?.id || "";

  if (!isOrdersLoading) {
    paginationModel = { currentPage, ...ordersData?.data?.pagination };
  }

  const onSortChange = (event) => {
    const sortId = event?.target?.value;
    const params = new URLSearchParams(searchParams);
    if (sortId === "createdAt") {
      searchParams?.delete("sort");
      setSearchParams(searchParams);
    } else {
      params?.set("sort", sortId);
      setSearchParams(params?.toString());
    }
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
            <h3>Sort by latest:</h3>
            <Form.Select
              defaultValue={defaultSelectedId}
              onChange={onSortChange}
              style={{ cursor: "pointer" }}
            >
              {ordersData?.data?.sorts?.map((option) => (
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
