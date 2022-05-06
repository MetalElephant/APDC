import restCalls from "../restCalls"
import {useHistory} from "react-router-dom"

export default function Logout() {
    let history = useHistory();

    function logoutManager() {
        restCalls.logout();
        history.push("/welcome")
    }

    return (
        logoutManager()
    )
}