import React from "react"
import Navbar from "./components/Navbar"
import LoginRegister from "./components/LoginRegister"
import Main from "./components/Main"
import {UserContext} from "./components/UserContext"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './style.css';
import { useState } from "react"
import { useMemo } from "react";

export default function App() {

    const[user, setUser] = useState(null);

    const value = useMemo(() => ({user, setUser}), [user, setUser]);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="content">
                    <Switch>
                        <Route exact path="/welcome">
                            <LoginRegister />
                        </Route>
                        <UserContext.Provider value={value}>
                            <Route exact path="/main">
                                <Main/>
                            </Route>
                        </UserContext.Provider>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}