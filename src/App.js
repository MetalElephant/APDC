import React from "react"
import { useEffect } from "react";
import NavbarLR from "./mainFixedComponents/NavbarLR"
import NavbarOps from "./mainFixedComponents/NavbarOps";
import LoginRegister from "./userComponents/LoginRegister"
import REPnavbar from "./mainFixedComponents/REPnavbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './style.css';
import NavbarMerchants from "./mainFixedComponents/NavbarMerchants";
//import NavbarSU from "./mainFixedComponents/NavbarSU";
//import NavbarMOD from "./mainFixedComponents/NavbarMOD";
import AdminsNavBar from "./admins/AdminsNavBar";
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
                    <Route exact path="/proprietario">
                        <NavbarOps />
                    </Route>
                    <Route exact path="/comerciante">
                        <NavbarMerchants />
                    </Route>
                    <Route exact path="/representante">
                        <REPnavbar />
                    </Route>
                    <Route exact path="/moderador">
                        <AdminsNavBar />
                    </Route>
                    <Route exact path="/superuser">
                        <AdminsNavBar />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}