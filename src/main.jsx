import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import logo from './images/logo.png';

const favicon = document.querySelector("link[rel='icon']");
if (favicon) {
  favicon.href = logo;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  
);
