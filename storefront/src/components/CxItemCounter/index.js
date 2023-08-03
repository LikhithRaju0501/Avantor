import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import "./index.css";

const CxItemCounter = ({ quantity }) => {
  const methods = useFormContext();
  const [count, setCount] = useState(quantity || 1);

  const changeValue = (value) => {
    if (count === 1 && value < 1) return;
    setCount((prevCount) => prevCount + value);
  };
  return (
    <div>
      <div
        className="item-counter"
        style={{ border: "1px solid black", width: "max-content" }}
      >
        <button
          className="counter-btn"
          id="decrement"
          style={{ border: "0px" }}
          onClick={() => changeValue(-1)}
        >
          -
        </button>
        <input
          type="number"
          id="item-count"
          value={count}
          min="1"
          style={{ border: "0px" }}
          {...methods?.register("quantity", { value: count })}
          readOnly
        />
        <button
          className="counter-btn"
          id="increment"
          style={{ border: "0px" }}
          onClick={() => changeValue(1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CxItemCounter;
