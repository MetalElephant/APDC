import restCalls from "../restCalls"
import {useHistory} from "react-router-dom"

export default function Logout() {
    let history = useHistory();

    function logoutManager(e) {
        e.preventDefault()
        restCalls.logout().then(() => {history.push("/")})
    }

    return (
        logoutManager()
    )
}