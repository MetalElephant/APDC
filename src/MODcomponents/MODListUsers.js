import { Box, Typography, Grid, Paper, Autocomplete, TextField, Button, Alert } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";

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
    const [repeat, setRepeat] = react.useState(false)
    const [isUserRemoved, setIsUserRemoved] = react.useState(false)
    const [isUserNotRemoved, setIsUserNotRemoved] = react.useState(true)
    const [displayMessage, setDisplayMessage] = react.useState(false)

    useEffect(() => {
        restCalls.listUsers()
        var users = JSON.parse(localStorage.getItem('allUsers'))
        var temp = []
        if (users != null) {
            users.map((user) => {
                temp.push(user)
            })
            setAllUsers(temp)
        }
        else {
            setRepeat(!repeat)
        }
    }, [repeat])


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

    function userToBeRemovedManager() {
        if(chosenUser != null) {
            restCalls.deleteUser(chosenUser).then(() => { restCalls.listUsers(); setIsUserRemoved(true); setIsUserNotRemoved(false); setDisplayMessage(true); }).catch(() => { setIsUserRemoved(false); setIsUserNotRemoved(true); setDisplayMessage(true) })
        }else {
            setIsUserRemoved(false); 
            setIsUserNotRemoved(true);
            setDisplayMessage(true)
        }
    }

    return (
        <>
            <Grid item xs={1.5} >
                <Autocomplete
                    selectOnFocus
                    id="users"
                    options={allUsers != null ? allUsers : []}
                    getOptionLabel={option => option.username}
                    onChange={(event, newChosenUser) => {
                        setChosenUser(newChosenUser.username);
                        setUser(newChosenUser)
                    }}
                    sx={{ width: 200, mt: 1 }}
                    renderInput={(params) => <TextField {...params} label="Utilizadores" />}
                />

                <Button onClick={userToBeRemovedManager} variant="contained" size="large" color="error" sx={{ mt: 2 }}>Remover Utilizador</Button>

                {(isUserRemoved && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador removido com sucesso.</Typography>
                    </Alert> : <></>}
                {(isUserNotRemoved && displayMessage) ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção do utilizador. Por favor, verifique o nome do mesmo.</Typography>
                    </Alert> : <></>}
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