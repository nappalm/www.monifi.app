import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./providers";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
