import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

const SearchItem = ({ productId, product, description, supplier, price }) => {
  return (
    <div className="searchItem">
      <div className="d-flex search-item">
        <div className="item-details">
          <h4>
            <Link style={{ textDecoration: "none" }} to={`/p/${productId}`}>
              {product}
            </Link>
          </h4>
          <div className="item-description">
            <p>{description}</p>
            <div>
              <h5>Price : {price?.formattedValue || "-"}</h5>
            </div>
            <div>
              <span>Supplier</span> : {supplier?.supplierName || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
