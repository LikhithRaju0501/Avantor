import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetProductDetails } from "../../api/products";
import ProductImageSection from "./ProductImageSection";
import "./index.css";
import CxItemCounter from "../../components/CxItemCounter";
import { useForm, FormProvider } from "react-hook-form";

const ProductPage = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const methods = useForm();

  const { isLoading, data, isError, error } = useGetProductDetails(productId);
  const addToCart = () => {
    console.log(methods.watch("quantity"));
  };

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
            <hr />
            <h5>Buy this item</h5>
            <FormProvider {...methods}>
              <CxItemCounter />
            </FormProvider>
            <button className="btn btn-primary mt-3" onClick={addToCart}>
              Add To Cart
            </button>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default ProductPage;
