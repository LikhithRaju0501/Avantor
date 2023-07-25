import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import "./index.css";

const CxItemCounter = () => {
  const methods = useFormContext();
  const [count, setCount] = useState(0);

  const changeValue = (value) => {
    setCount((prevCount) => prevCount + value);
  };
  return (
    <div>
      <div
        class="item-counter"
        style={{ border: "1px solid black", width: "max-content" }}
      >
        <button class="counter-btn" id="decrement" style={{ border: "0px" }} onClick={() =>changeValue(-1)}>
          -
        </button>
        <input
          type="number"
          id="item-count"
          value={count}
          min="0"
          style={{ border: "0px" }}
          {...methods?.register("quantity", {value:count})}
          readOnly
        />
        <button class="counter-btn" id="increment" style={{ border: "0px" }} onClick={() =>changeValue(1)}>
          +
        </button>
      </div>
    </div>
  );
};

export default CxItemCounter;
