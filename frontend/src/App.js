// import { useState } from "react";
import "./App.css";
// browserName
// osName
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login";
import { browserName as name, osName as os } from "react-device-detect";
import Signup from "./Signup";
import Main from "./Main";
import Profile from "./Profile";
import Preview from "./Preview";
import Barcode from "./Barcode";
import "./App.css";
import User from "./User";
import Setting from "./Setting";
function App() {
  console.log("name = ", name, " os = ", os);

  return (
    <Router>
      <Switch>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/scan">
          <Barcode />
        </Route>
        <Route exact path="/preview">
          <Preview />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/home">
          <Main />
        </Route>
        <Route exact path="/">
          <Signup />
        </Route>
        <Route exact path="/setting">
          <Setting />
        </Route>
        <Route exact path="/:username">
          <User />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
