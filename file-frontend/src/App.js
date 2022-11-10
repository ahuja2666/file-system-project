import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/login/login";
import Logout from "./Components/logout/logout";

const App = () => {
  const loggedin = localStorage.getItem("loggedin")
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={loggedin ? <Logout /> : <Login />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;