import { Box, Typography, Grid, Paper, Autocomplete, TextField, Button, Alert, Radio, FormControl, FormControlLabel, RadioGroup, FormLabel } from "@mui/material";
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
    const [isUserModified, setIsUserModified] = react.useState(false)
    const [isUserNotModified, setIsUserNotModified] = react.useState(true)
    const [displayModifyMessage, setDisplayModifyMessage] = react.useState(false)
    const [loaded, setLoaded] = react.useState(false)

    var users = JSON.parse(localStorage.getItem('allUsers'))

    useEffect(() => {
        restCalls.listAllUsers().then(() => { setLoaded(true); users = JSON.parse(localStorage.getItem('allUsers')) })
    }, [])

    useEffect(() => {
        var temp = []
        if (users != null) {
            users.map((user) => {
                temp.push(user)
            })
            setAllUsers(temp)
        }
    }, [loaded])


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
        if (chosenUser != null) {
            restCalls.deleteUser(chosenUser)
                .then(() => { restCalls.listAllUsers(); setIsUserRemoved(true); setIsUserNotRemoved(false); setDisplayMessage(true) })
                .catch(() => { setIsUserRemoved(false); setIsUserNotRemoved(true); setDisplayMessage(true) })
            setDisplayModifyMessage(false)
        } else {
            setIsUserRemoved(false);
            setIsUserNotRemoved(true);
            setDisplayMessage(true)
        }
    }

    function usernameHandler(event) {
        setUsername(event.target.value)
    }

    function emailHandler(event) {
        setEmail(event.target.value)
    }

    function nameHandler(event) {
        setName(event.target.value)
    }

    function roleHandler(event) {
        setRole(event.target.value)
    }

    function visibilityHandler(event) {
        setVisibility(event.target.value)
    }

    function homePhoneHandler(event) {
        setHomePhone(event.target.value)
    }

    function mobilePhoneHandler(event) {
        setMobilePhone(event.target.value)
    }

    function addressHandler(event) {
        setAddress(event.target.value)
    }

    function nifHandler(event) {
        setNif(event.target.value)
    }

    function modifyUserManager() {
        restCalls.modifyUserAttributes(username, name, email, visibility, address, homePhone, mobilePhone, nif)
            .then(() => { restCalls.listAllUsers(); setIsUserModified(true); setIsUserNotModified(false); setDisplayModifyMessage(true) })
            .catch(() => { setIsUserModified(false); setIsUserNotModified(true); setDisplayModifyMessage(true) })
        setDisplayMessage(false)
    }

    return (
        <>
            <Grid item xs={2} >
                <Autocomplete
                    selectOnFocus
                    id="users"
                    options={allUsers != null ? allUsers : []}
                    getOptionLabel={option => option.username}
                    onChange={(event, newChosenUser) => {
                        setChosenUser(newChosenUser.username);
                        setUser(newChosenUser)
                    }}
                    sx={{ width: "80%", mt: 2 }}
                    renderInput={(params) => <TextField {...params} label="Utilizadores" />}
                />

                <Button onClick={userToBeRemovedManager} variant="contained" size="large" color="error" sx={{ mt: 2, width: "80%" }}>Remover Utilizador</Button>
            </Grid>
            <Grid item xs={4} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="username"
                        label="Nome de Utilizador"
                        value={username}
                        id="username"
                        color="success"
                        onChange={usernameHandler}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="role"
                        label="Papel"
                        value={role}
                        id="role"
                        color="success"
                        onChange={roleHandler}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="email"
                        label="Email"
                        value={email}
                        id="email"
                        color="success"
                        onChange={emailHandler}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="name"
                        label="Nome"
                        value={name}
                        id="name"
                        color="success"
                        onChange={nameHandler}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label" ><Typography color="green">Visibilidade de Perfil</Typography></FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            row
                            value={visibility}
                            onChange={(event) => { setVisibility(event.target.value) }}
                        >
                            <FormControlLabel value="Public" control={<Radio color="success" />} label="Público" sx={{ color: "black" }} />
                            <FormControlLabel value="Private" control={<Radio color="success" />} label="Privado" sx={{ color: "black" }} />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="homePhone"
                        label="Número de Telefone"
                        value={homePhone}
                        id="homePhone"
                        color="success"
                        onChange={homePhoneHandler}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="mobilePhone"
                        label="Número de Telemóvel"
                        value={mobilePhone}
                        id="mobilePhone"
                        color="success"
                        onChange={mobilePhoneHandler}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="address"
                        label="Morada"
                        value={address}
                        id="address"
                        color="success"
                        onChange={addressHandler}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="nif"
                        label="NIF"
                        value={nif}
                        id="nif"
                        color="success"
                        onChange={nifHandler}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    sx={{ width: "92%", mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={modifyUserManager}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar Utilizador </Typography>
                </Button>
            </Grid>
            <Grid item xs={4}>
                {(isUserRemoved && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador removido com sucesso.</Typography>
                    </Alert> : <></>}
                {(isUserNotRemoved && displayMessage) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção do utilizador. Por favor, verifique o nome do mesmo.</Typography>
                    </Alert> : <></>}

                {(isUserModified && displayModifyMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador modificado com sucesso.</Typography>
                    </Alert> : <></>}
                {(isUserNotModified && displayModifyMessage) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na modificação do utilizador.</Typography>
                    </Alert> : <></>}
            </Grid>
        </>
    )
}