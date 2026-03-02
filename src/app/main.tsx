import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./providers";
// import { enableMocking } from "@/lib/msw/browser";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

// enableMocking().then(() =>
//   ReactDOM.createRoot(document.getElementById("root")).render(
//     <React.StrictMode>
//       <Providers />
//     </React.StrictMode>,
//   ),
// )

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>,
);
