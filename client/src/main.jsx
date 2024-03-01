import "./init"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import { ConfettiProvider } from "./components/providers/ConfettiProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
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
