import React from "react";
import { useGetOrders } from "../../api/orders";
import { CxPagination, CxSpinner } from "../../components";
import OrderItems from "./OrderItems";
import { useSearchParams } from "react-router-dom";

const OrdersPage = () => {
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams?.get("currentPage")) || 0;
  const { data: ordersData, isLoading: isOrdersLoading } =
    useGetOrders(currentPage);

  let paginationModel = {
    pageSize: 0,
    totalResults: 0,
    currentPage,
    totalPages: 0,
  };

  if (!isOrdersLoading) {
    paginationModel = { currentPage, ...ordersData?.data?.pagination };
  }
  return isOrdersLoading ? (
    <CxSpinner />
  ) : (
    <div className="p-4">
      <div className="d-flex">
        <div style={{ flexBasis: "25%" }}>Facets</div>
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
            <ul style={{ listStyle: "none", padding: "0" }}>
              <li
                style={{
                  borderRadius: "3px",
                  padding: "25px 30px",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "25px",
                  backgroundColor: "#95A5A6",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                <div
                  style={{ flexBasis: "20%" }}
                  className="text-break fw-bold p-2"
                >
                  Order#
                </div>
                <div
                  style={{ flexBasis: "20%" }}
                  className="text-break fw-bold p-2"
                >
                  Date Placed
                </div>
                <div
                  style={{ flexBasis: "10%" }}
                  className="text-break fw-bold p-2"
                >
                  Number of Items
                </div>
                <div
                  style={{ flexBasis: "20%" }}
                  className="text-break fw-bold p-2"
                >
                  Order Status
                </div>
                <div
                  style={{ flexBasis: "20%" }}
                  className="text-break fw-bold p-2"
                >
                  Price
                </div>
                <div
                  style={{ flexBasis: "10%" }}
                  className="text-break fw-bold p-2"
                >
                  Items
                </div>
              </li>
              {ordersData?.data?.orders?.map((order) => {
                return <OrderItems key={order?._id} order={order} />;
              })}
            </ul>
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
