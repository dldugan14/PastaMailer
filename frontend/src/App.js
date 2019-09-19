import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import "./App.css";
import Login from "./conponents/login";
import Header from "./conponents/Header/Header";
import theme from "./theme";
import { createMemoryHistory } from "history";

const history = createMemoryHistory();

export default function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Header />
        <Router history={history}>
          <Switch>
            <Route path="/" component={Login} />
            <Route path="/dicks" render={() => <div>Dicks</div>} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}
