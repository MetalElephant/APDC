import React, { useState } from "react"
import NavbarLR from "./mainFixedComponents/NavbarLR"
import NavbarOps from "./mainFixedComponents/NavbarOps";
import LoginRegister from "./userComponents/LoginRegister"
import ForumMessagesPage from "./forumComponents/ForumMessagesPage";
import ParcelsPage from "./parcelComponents/ParcelsPage"
import DrawerMessingAround from "./mainFixedComponents/DrawerMessingAround"

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './style.css';



export default function App() {

    return (
        <Router>
            <div className="content">
                <Switch>
                    <Route exact path="/">
                        <NavbarLR />
                        <LoginRegister />
                    </Route>
                    <Route exact path="/main">
                        <NavbarOps />
                    </Route>
                    <Route exact path="/main/forumDiscussion">
                        <NavbarLR />
                        <ForumMessagesPage />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}