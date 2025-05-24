import { Route, Routes } from "react-router-dom";

import Portfolio from "./pages/Portfolio";


function App() {
  return (
    <Routes>
      <Route element={<Portfolio/>} path="/" />
    </Routes>
  );
}

export default App;
