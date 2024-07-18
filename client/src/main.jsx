import "./init";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import "./styles/prism.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import { ConfettiProvider } from "./components/providers/ConfettiProvider";
import { registerLicense } from "@syncfusion/ej2-base";
import "react-circular-progressbar/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import { resetScroll } from "./lib/scrollReset";

registerLicense(import.meta.env.VITE_EJ2_LICENSE_KEY);

function Root() {
  useEffect(() => {
    resetScroll();
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <ConfettiProvider />
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);