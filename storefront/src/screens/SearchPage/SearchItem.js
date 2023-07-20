import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

const SearchItem = ({ productId, product, description, supplierName }) => {
  return (
    <div className="searchItem">
      <div className="d-flex search-item">
        <div className="item-details">
          <h4>
            <Link style={{ textDecoration: "none" }} to={`/p/${productId}`}>
              {product}
            </Link>
            <div className="item-description">
              <p>{description}</p>
              <div>
                <span>Supplier</span>:{supplierName || "-"}
              </div>
            </div>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
