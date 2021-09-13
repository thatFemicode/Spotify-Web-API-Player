import logo from "./logo.svg";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

const code = new URLSearchParams(window.location.search).get("code");
function App() {
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
