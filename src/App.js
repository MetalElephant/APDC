import React, { useState } from "react"
import Navbar from "./mainFixedComponents/Navbar"
import LoginRegister from "./userComponents/LoginRegister"
import Main from "./mainFixedComponents/Main"


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