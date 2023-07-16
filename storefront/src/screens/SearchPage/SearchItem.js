import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

const SearchItem = ({ productId }) => {
  return (
    <div className="searchItem">
      <div className="d-flex search-item">
        <section>
          <img
            src="https://media.istockphoto.com/id/1465409254/photo/acetone-in-bottle-chemical-in-the-laboratory-and-industry.webp?b=1&s=170667a&w=0&k=20&c=3O480LMsUAAXEbfjiGsiXxLBISTVKDw9eC0ZGM-qIkY="
            alt=""
            style={{ width: "20vw", height: "40vh" }}
          />
        </section>
        <div className="item-details">
          <h4>
            <Link style={{ textDecoration: "none" }} to={`/p/${productId}`}>
              Product Name
            </Link>
            <div className="item-description">
              <p>
                lorem ispum lorem ispum lorem ispum lorem ispum lorem ispum
                lorem ispum lorem ispum lorem ispum lorem ispum lorem ispum
                lorem ispum lorem ispum
              </p>
            </div>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
