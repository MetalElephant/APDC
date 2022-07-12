import { Box, Typography, Grid, Paper } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls"
import avatar from "../images/avatar.png"

export default function UserInfo() {

    const [username, setUsername] = react.useState("")
    const [email, setEmail] = react.useState("")
    const [name, setName] = react.useState("")
    const [landphone, setLandphone] = react.useState("")
    const [mobilephone, setMobilephone] = react.useState("")
    const [street, setStreet] = react.useState("")
    const [nif, setNif] = react.useState("")
    const [role, setRole] = react.useState("")
    const [image, setImage] = react.useState("")
    const [district, setDistrict] = react.useState("")
    const [county, setCounty] = react.useState("")
    const [autarchy, setAutarchy] = react.useState("")

    useEffect(() => {
        restCalls.userInfo()
        var user = JSON.parse(localStorage.getItem('user'))

        setUsername(user.username)
        setEmail(user.email)
        setName(user.name)
        setLandphone(user.landphone)
        setMobilephone(user.mobilephone)
        setStreet(user.street)
        setNif(user.nif)
        setImage(user.photo)
        setRole(user.role)
        setDistrict(user.district)
        setCounty(user.county)
        setAutarchy(user.autarchy)
    }, [])

    return (
        <>
            <Grid item xs={5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Nome de Utilizador: {username} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Email: {email} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Função: {role} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Nome: {name} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Distrito: {district} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Concelho: {county} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Freguesia: {autarchy} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Número de Telefone: {landphone} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Número de Telemóvel: {mobilephone} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Morada: {street} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> NIF: {nif} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={5}
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                {image.toLocaleUpperCase() !== "NÃO DEFINIDO" ?
                    <Box component="img" src={image} sx={{ height: "80%", width: "80%", objectFit: "contain" }} />
                    :
                    <Box component="img" src={avatar} sx={{ height: "80%", width: "80%", objectFit: "contain" }} />
                }
            </Grid>
        </>
    )
}