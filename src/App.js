import React from "react"
import Navbar from "./components/Navbar"
import LoginRegister from "./components/LoginRegister"
import Profile from "./components/Profile"
import Main from "./components/Main"
import RegisterParcel from "./components/RegisterParcel"

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
                        <Route exact path="/profile">
                            <Profile />
                        </Route>
                        <Route exact path="/main">
                            <Main/>
                        </Route>
                        <Route exact path="/registerParcel">
                            <RegisterParcel />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}