import React, { useState } from "react"
import Navbar from "./components/Navbar"
import LoginRegister from "./components/LoginRegister"
import Profile from "./components/Profile"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './style.css';

export default function App() {
    const [show, setShow] = useState(false);

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
                    </Switch>
                </div>
            </div>
        </Router>
    )
}