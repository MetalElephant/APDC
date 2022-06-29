import { Box, Typography, Grid, Paper, Autocomplete, TextField } from "@mui/material";
import mapsAvatar from "../images/maps-avatar.png";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import { color } from "@mui/system";

export default function ListUsers() {

    const [chosenUser, setChosenUser] = react.useState()
    const [username, setUsername] = react.useState("")
    const [role, setRole] = react.useState("")
    const [email, setEmail] = react.useState("")
    const [name, setName] = react.useState("")
    const [visibility, setVisibility] = react.useState("")
    const [homePhone, setHomePhone] = react.useState("")
    const [mobilePhone, setMobilePhone] = react.useState("")
    const [address, setAddress] = react.useState("")
    const [nif, setNif] = react.useState("")
    const [allUsers, setAllUsers] = react.useState([])
    const [user, setUser] = react.useState([])

    var users = JSON.parse(localStorage.getItem('allUsers'))

    useEffect(() => {
        restCalls.listUsers()
        var temp = []
        if (users != null) {
            users.map((user) => {
                temp.push(user)
            })
        }
        setAllUsers(temp)
    }, [])


    useEffect(() => {
        setUsername(user.username)
        setRole(user.role)
        setName(user.name)
        setEmail(user.email)
        setVisibility(user.visibility)
        setHomePhone(user.landphone)
        setMobilePhone(user.mobilephone)
        setAddress(user.address)
        setNif(user.nif)
    }, [user])

    return (
        <>
            <Grid item xs={1.5} >
                <Autocomplete
                    selectOnFocus
                    id="users"
                    options={users}
                    getOptionLabel={option => option.username}
                    onChange={(event, newChosenUser) => {
                        setChosenUser(newChosenUser.username);
                        setUser(newChosenUser)
                    }}
                    sx={{ width: 200, mt: 1 }}
                    renderInput={(params) => <TextField {...params} label="Utilizadores" />}
                />
            </Grid>
            <Grid item xs={4.5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Nome de utilizador: {username} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Email: {email} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Nome: {name} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Papel: {role} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Visibilidade: {visibility} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Número de Telefone: {homePhone} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Número de Telemóvel: {mobilePhone} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Morada: {address} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> NIF: {nif} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={4}>
            </Grid>
        </>
    )
}