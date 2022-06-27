import { Box, Typography, Grid, Paper} from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import userAvatar from "../images/user-avatar.png";

export default function UserInfo() {

    const [username, setUsername] = react.useState("")
    const [email, setEmail] = react.useState("")
    const [name, setName] = react.useState("")
    const [visibility, setVisibility] = react.useState("")
    const [landphone, setLandphone] = react.useState("")
    const [mobilephone, setMobilephone] = react.useState("")
    const [address, setAddress] = react.useState("")
    const [nif, setNif] = react.useState("")
    const [role,setRole] = react.useState("")
    const [image, setImage] = react.useState("")

    useEffect(() => {
        var user = JSON.parse(localStorage.getItem('user'))

        setUsername(user.username)
        setEmail(user.email)
        setName(user.name)
        setVisibility(user.visibility)
        setLandphone(user.landphone)
        setMobilephone(user.mobilephone)
        setAddress(user.address)
        setNif(user.nif)
        setImage(user.photo)
        setRole(user.role)
    }, [])

    return (
        <>  
            <Grid item xs={5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18}}> Nome de Utilizador: {username} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Email: {email} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Função: {role} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Nome: {name} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Visibilidade: {visibility} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Número de Telefone: {landphone} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Número de Telemóvel: {mobilephone} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> Morada: {address} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{fontFamily: 'Verdana', fontSize: 18}}> NIF: {nif} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={3.5} 
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
            >       
                <Box component="img" src = {image} sx={{height: "500px", width: "500px", objectFit: "contain"}}   />
            </Grid>
        </>
    )
}