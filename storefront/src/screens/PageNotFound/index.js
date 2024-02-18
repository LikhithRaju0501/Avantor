import React from "react";

const PageNotFound = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column vh-100"
      id="PageNotFound"
    >
      <h4>Look's like you are lost.</h4>
      <p className="text-break text-center" style={{ width: "75vw" }}>
        You didn't break the internet but we couldn't find what you are looking
        for. So instead we made this page specially for you as a reminder that
        not everything in life works out. But somehow most things do, in the
        end.
      </p>
    </div>
  );
};

export default PageNotFound;
