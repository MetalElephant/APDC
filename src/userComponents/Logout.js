import restCalls from "../restCalls"
import {useHistory} from "react-router-dom"

export default function Logout() {
    let history = useHistory();

    function logoutManager(e) {
        restCalls.logout().then(() => {history.push("/")})
    }

    return (
        logoutManager()
    )
}