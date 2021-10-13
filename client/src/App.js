import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Header from './Components/Header';
import NewSchemeForm from './Components/NewSchemeForm';
import ViewScheme from './Components/ViewScheme';
import UpdateScheme from './Components/UpdateScheme';
function App() {
  return (
    <div className="App">
    <Header />
    <Router>
    

      <Switch>
        
        <Route path="/newscheme">
          <NewSchemeForm />
        </Route>
        <Route path="/scheme">
        <ViewScheme />
        </Route>
        <Route path="/updatescheme/:id" component={UpdateScheme}>
        </Route>
        
        <Route path="/">
        <ViewScheme />
        </Route>

      </Switch>
        </Router>
    </div>
  );
}

export default App;
