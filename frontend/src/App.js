import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom"
import LandingPage from './pages/LandingPage';
import SelectCategory from './pages/SelectCategory';
import SuccessfulRegister from './pages/SuccessfulRegister';


function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path='/' exact>
            <LandingPage />
          </Route>
          <Route path='/category' exact>
            <SelectCategory />
          </Route>
          <Route path='/form' exact>
            <LandingPage />
          </Route>
          <Route path='/success' exact>
            <SuccessfulRegister />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
