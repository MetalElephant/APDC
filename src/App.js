import React from "react"
import { useEffect } from "react";
import NavbarLR from "./mainFixedComponents/NavbarLR"
import NavbarOps from "./mainFixedComponents/NavbarOps";
import AdministrationPage from "./mainFixedComponents/AdministrationPage";
import LoginRegister from "./userComponents/LoginRegister"
import ForumMessagesPage from "./forumComponents/ForumMessagesPage";
import NavbarMessages from "./mainFixedComponents/NavbarMessages";
import NavbarMayors from "./mainFixedComponents/NavbarMayors";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './style.css';
import NavbarMerchants from "./mainFixedComponents/NavbarMerchants";
import NavbarSU from "./mainFixedComponents/NavbarSU";
import NavbarMOD from "./mainFixedComponents/NavbarMOD";
import restCalls from "./restCalls"



export default function App() {

    useEffect(() => {
        const handleTabClose = event => {
          event.preventDefault();
          restCalls.logout()
        };
    
        window.addEventListener('beforeunload', handleTabClose);
    
        return () => {
          window.removeEventListener('beforeunload', handleTabClose);
        };
      }, []);

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
                        <NavbarMessages />
                        <ForumMessagesPage />
                    </Route>
                    <Route exact path="/administration">
                        <AdministrationPage />
                    </Route>
                    <Route exact path="/merchants">
                        <NavbarMerchants />
                    </Route>
                    <Route exact path="/mayors">
                        <NavbarMayors />
                    </Route>
                    <Route exact path="/moderador">
                        <NavbarMOD />
                    </Route>
                    <Route exact path="/superuser">
                        <NavbarSU />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}