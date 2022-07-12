import React from "react"
import NavbarLR from "./mainFixedComponents/NavbarLR"
import NavbarOps from "./mainFixedComponents/NavbarOps";
import LoginRegister from "./userComponents/LoginRegister"
import REPnavbar from "./mainFixedComponents/REPnavbar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './style.css';
import NavbarMerchants from "./mainFixedComponents/NavbarMerchants";
import AdminsNavBar from "./admins/AdminsNavBar";


export default function App() {

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