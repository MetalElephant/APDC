import React, { useState } from "react"
import Navbar from "./components/Navbar"
import LoginRegister from "./components/LoginRegister"
import Main from "./components/Main"


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
                            <LoginRegister />
                        </Route>
                        <Route exact path="/main">
                            <Main />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}