import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetProductDetails } from "../../api/products";
import ProductImageSection from "./ProductImageSection";
import "./index.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();

  const { isLoading, data, isError, error } = useGetProductDetails(productId);

  return (
    <div style={{ padding: "1vh 10vw" }}>
      {!isLoading ? (
        <div className="product-img-description">
          <ProductImageSection />
          <div className="product-product-details">
            <h2>{data?.data?.product}</h2>
            <hr />
            <h5>About this item</h5>
            <p>{data?.data?.description}</p>
            <hr />
            <h5>Delivery related:</h5>
            {data?.data?.supplier && (
              <span>Supplier- {data?.data?.supplier?.supplierName}</span>
            )}
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default ProductPage;
