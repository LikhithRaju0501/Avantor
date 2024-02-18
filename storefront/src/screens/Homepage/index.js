import React from "react";
import Banner from "../../assets/ammijan-high-resolution-logo-black.png";
import { CmsComponent } from "../../components";

const Homepage = () => {
  return (
    <div id="HomePage">
      <img src={Banner} style={{ width: "100%", height: "70vh" }} />
      <div className="container">
        <CmsComponent />
      </div>
    </div>
  );
};

export default Homepage;
