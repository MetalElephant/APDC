import restCalls from "../restCalls"
import { Typography } from "@mui/material";
import react from 'react';
import { useEffect } from "react";

export default function UserInfo() {

    const [username, setUsername] = react.useState("")
    const [email, setEmail] = react.useState("")
    const [address, setAddress] = react.useState("")
    const [landphone, setLandphone] = react.useState("")
    const [mobilephone, setMobilephone] = react.useState("")
    const [nif, setNif] = react.useState("")

    useEffect(() => {
        if(localStorage.getItem('user') === null)
            restCalls.userInfo()
        var user = JSON.parse(localStorage.getItem('user'))
        setUsername(user.username)
        setEmail(user.email)
        setAddress(user.address)
        setLandphone(user.landphone)
        setMobilephone(user.mobilephone)
        setNif(user.nif)


    })

    return (
       <div>
       <p><Typography> Username: {username}</Typography></p> 
       <p><Typography> Email: {email}</Typography></p>
        <Typography> Address: {address}</Typography>
        <Typography> LandPhone: {landphone}</Typography>
        <Typography> MobilePhone: {mobilephone}</Typography>
        <Typography> NIF: {nif}</Typography>
        </div>
       

    )
}