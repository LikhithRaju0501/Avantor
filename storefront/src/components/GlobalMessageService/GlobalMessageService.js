import React, { createContext, useContext, useState } from "react";

const GlobalMessageContext = createContext();

export const useGlobalMessage = () => {
  return useContext(GlobalMessageContext);
};

export const GlobalMessageProvider = ({ children }) => {
  const [message, setMessage] = useState({});

  const addMessage = (text, type) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({});
    }, 3000);
  };

  return (
    <GlobalMessageContext.Provider value={{ message, addMessage }}>
      {message?.text && <GlobalMessage />}
      {children}
    </GlobalMessageContext.Provider>
  );
};

export const GlobalMessage = () => {
  const { message } = useGlobalMessage();

  return (
    <div
      style={{
        backgroundColor:
          message?.type === "error"
            ? "#ff7979"
            : message?.type === "success"
            ? "#20bf6b"
            : message?.type === "info"
            ? "#4bcffa"
            : "",
      }}
      className="text-center p-4 text-break"
    >
      <div className="h4" style={{ color: "#dff9fb" }}>
        {message?.text}
      </div>
    </div>
  );
};
