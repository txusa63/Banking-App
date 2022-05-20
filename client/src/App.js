import { UserContextProvider } from "./context/UserContext";
import Router from "./Router";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AccountContextProvider } from "./context/AccountContext";


function App() {
  return (
    <div className="">
      <UserContextProvider>
        <AccountContextProvider>
          <Router />
        </AccountContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
