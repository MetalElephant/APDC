import restCalls from "../restCalls";
import { useEffect } from "react";

export default function AdministrationPage() {

    useEffect(() => {
        restCalls.createSuperUser();
        restCalls.createStatistics()
    })

    return (
        <div> Admin page. TBC</div>
    )
}