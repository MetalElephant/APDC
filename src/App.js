import React from "react"
import Navbar from "./components/Navbar"
import Main from "./components/Main"
import Profile from "./components/Profile"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './style.css';

export default function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="content">
                    <Switch>
                        <Route exact path="/">
                            <Main />
                        </Route>
                        <Route exact path="/profile">
                            <Profile />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}