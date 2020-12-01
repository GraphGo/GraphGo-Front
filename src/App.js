import "./App.css";
import CMS from './views/CMS/CMS'
import Login from './views/LogIn/Login'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import CanvasPage from './views/CanvasPage/CanvasPage'
import history from "./utils/history"
function App() {
  return (
    <div className="App">
    <Router history={history}>
      <Switch>
        <Route path='/canvas'>
          <CanvasPage />
        </Route>
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
