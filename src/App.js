import "./App.css";
import CMS from './views/CMS/CMS'
import Login from './views/LogIn/Login'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'


function App() {
  return (
    <div className="App">
    <Router>
      <Switch>
        <Route path="/CMS">
          <CMS />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
