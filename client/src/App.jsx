import { Routes, Route, Navigate } from "react-router-dom";

import AuthPage from "./pages/AuthPage";


function App() {
	return (
	<Routes>
      <Route path="/" element={<AuthPage />}/>
	</Routes>
	);
}

export default App;
