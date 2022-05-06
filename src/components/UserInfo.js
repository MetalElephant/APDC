import restCalls from "../restCalls"
import { Typography } from "@mui/material";
import react from 'react';
import { useEffect } from "react";

export default function UserInfo() {

    const [username, setUsername] = react.useState("")
    const [email, setEmail] = react.useState("")

    useEffect(() => {
        if(localStorage.getItem('user') === null)
            restCalls.userInfo()
        var user = JSON.parse(localStorage.getItem('user'))
        setUsername(user.username)

        setEmail(user.email)
    })

    return (
       <> <Typography> Username: {username}</Typography>
        <Typography> Email: {email}</Typography></>

    )
}