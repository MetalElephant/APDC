import { Box, Typography, Grid, Autocomplete, TextField, Button, Alert, CircularProgress } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import locais from "../locais/distritos.txt"

export default function ListUsers() {

    const [chosenUser, setChosenUser] = react.useState()
    const [username, setUsername] = react.useState("")
    const [role, setRole] = react.useState("")
    const [email, setEmail] = react.useState("")
    const [name, setName] = react.useState("")
    const [homePhone, setHomePhone] = react.useState("")
    const [mobilePhone, setMobilePhone] = react.useState("")
    const [street, setStreet] = react.useState("")
    const [nif, setNif] = react.useState("")
    const [allUsers, setAllUsers] = react.useState([])
    const [user, setUser] = react.useState([])
    const [isUserRemoved, setIsUserRemoved] = react.useState(false)
    const [isUserNotRemoved, setIsUserNotRemoved] = react.useState(true)
    const [displayMessage, setDisplayMessage] = react.useState(false)
    const [isUserModified, setIsUserModified] = react.useState(false)
    const [isUserNotModified, setIsUserNotModified] = react.useState(true)
    const [displayModifyMessage, setDisplayModifyMessage] = react.useState(false)
    const [loaded, setLoaded] = react.useState(false)
    const [emailErr, setEmailErr] = react.useState(false)
    const [mobilePhoneErr, setMobilePhoneErr] = react.useState(false)
    const [homePhoneErr, setHomePhoneErr] = react.useState(false)
    const [nifErr, setNifErr] = react.useState(false)
    const [showProgress, setShowProgress] = react.useState(false)

    const [distToConcState, setDistToConc] = react.useState()
    const [concToFregState, setConcToFreg] = react.useState()
    const [dist, setDist] = react.useState(null)
    const [conc, setConc] = react.useState(null)
    const [freg, setFreg] = react.useState(null)
    const [allDist, setAllDist] = react.useState([])
    const [allConc, setAllConc] = react.useState([])
    const [allFreg, setAllFreg] = react.useState([])

    var users = JSON.parse(localStorage.getItem('allUsers'))

    useEffect(() => {
        restCalls.listAllUsers().then(() => { setLoaded(true); users = JSON.parse(localStorage.getItem('allUsers')) })
        var split = []
        let distToConc = new Map()
        let concToFreg = new Map()
        let distritos = [];
        let concelhos = [];
        let freguesias = [];
        fetch(locais)
            .then(r => r.text())
            .then(text => {
                split = text.split(";")

                for (let i = 0; i < split.length; i++) {
                    var elem = split[i]
                    if (i % 3 == 0) {
                        if (!distToConc.has(elem)) {
                            distToConc.set(elem, [])
                            distritos.push(elem)
                        }
                        if (distToConc.get(elem).indexOf(split[i + 1]) == -1)
                            distToConc.get(elem).push(split[i + 1])
                    }
                    else if (i % 3 == 1) {
                        if (!concToFreg.has(elem)) {
                            concToFreg.set(elem, [])
                            concelhos.push(elem)
                        }
                        if (concToFreg.get(elem).indexOf(split[i + 1]) == -1)
                            concToFreg.get(elem).push(split[i + 1])
                    }
                    else {
                        if (freguesias.indexOf(elem) == -1)
                            freguesias.push(elem)
                    }
                }

                setAllDist(distritos)
                setAllConc(concelhos)
                setAllFreg(freguesias)
                setDistToConc(distToConc)
                setConcToFreg(concToFreg)
            });
    }, [])

    useEffect(() => {
        if (distToConcState != null && concToFregState != null) {
            if (distToConcState.has(dist)) {
                var temp = distToConcState.get(dist)
                setAllConc(temp)
            }

            if (concToFregState.has(conc)) {
                var temp = concToFregState.get(conc)
                setAllFreg(temp)
            }
        }
    }, [dist, conc])

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
        setHomePhone(user.landphone)
        setMobilePhone(user.mobilephone)
        setStreet(user.street)
        setNif(user.nif)
        setDist(user.district)
        setConc(user.county)
        setFreg(user.autarchy)
    }, [user])

    function userToBeRemovedManager() {
        if (chosenUser != null) {
            setShowProgress(true)
            restCalls.deleteUser(chosenUser)
                .then(() => { restCalls.listAllUsers(); setShowProgress(false); setIsUserRemoved(true); setIsUserNotRemoved(false); setDisplayMessage(true) })
                .catch(() => { setIsUserRemoved(false); setShowProgress(false); setIsUserNotRemoved(true); setDisplayMessage(true) })
            setDisplayModifyMessage(false)
        } else {
            setIsUserRemoved(false);
            setIsUserNotRemoved(true);
            setDisplayMessage(true)
        }
    }

    function modifyUserManager() {
        if (isValid()) {
            setShowProgress(true)
            restCalls.modifyUserAttributes(username, name, email, street, homePhone, mobilePhone, nif, null, dist, conc, freg)
                .then(() => { restCalls.listAllUsers(); setShowProgress(false); resetErrors(); setIsUserModified(true); setIsUserNotModified(false); setDisplayModifyMessage(true) })
                .catch(() => { setIsUserModified(false); setShowProgress(false); setIsUserNotModified(true); setDisplayModifyMessage(true) })
            setDisplayMessage(false)
        }
    }

    function resetErrors() {
        setEmailErr(false)
        setHomePhoneErr(false)
        setMobilePhoneErr(false)
        setNifErr(false)
    }

    function isValid() {
        var isValid = true
        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null) {
            setEmailErr(true);
            isValid = false;
        }
        else
            setEmailErr(false)

        if ((homePhone !== "") && ((homePhone.length !== 9 && homePhone.toLocaleUpperCase() !== "NÃO DEFINIDO") || (isNaN(homePhone) && homePhone.toLocaleUpperCase() !== "NÃO DEFINIDO"))) {
            isValid = false;
            setHomePhoneErr(true)
        }
        else
            setHomePhoneErr(false)

        if ((mobilePhone !== "") && ((mobilePhone.length !== 9 && mobilePhone.toLocaleUpperCase() !== "NÃO DEFINIDO") || (isNaN(mobilePhone) && mobilePhone.toLocaleUpperCase() !== "NÃO DEFINIDO"))) {
            isValid = false;
            setMobilePhoneErr(true)
        }
        else
            setMobilePhoneErr(false)

        if ((nif !== "") && ((nif.length !== 9 && nif.toLocaleUpperCase() !== "NÃO DEFINIDO") || (isNaN(nif) && nif.toLocaleUpperCase() !== "NÃO DEFINIDO"))) {
            isValid = false;
            setNifErr(true)
        }
        else
            setNifErr(false)

        return isValid
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
                        resetErrors()
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
                        onChange={(event) => { setEmail(event.target.value) }}
                    />
                </Box>
                {emailErr && <Typography sx={{ color: "red", fontSize: 14 }}> Formato de Email incorreto </Typography>}
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="name"
                        label="Nome"
                        value={name}
                        id="name"
                        color="success"
                        onChange={(event) => { setName(event.target.value) }}
                    />
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
                        onChange={(event) => { setHomePhone(event.target.value) }}
                    />
                </Box>
                {homePhoneErr && <Typography sx={{ color: "red", fontSize: 14 }}> Formato de número de telefone incorreto </Typography>}
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="mobilePhone"
                        label="Número de Telemóvel"
                        value={mobilePhone}
                        id="mobilePhone"
                        color="success"
                        onChange={(event) => { setMobilePhone(event.target.value) }}
                    />
                </Box>
                {mobilePhoneErr && <Typography sx={{ color: "red", fontSize: 14 }}> Formato de número de telemóvel incorreto </Typography>}
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <Autocomplete
                        selectOnFocus
                        id="distritos"
                        options={allDist}
                        getOptionLabel={option => option}
                        value={dist}
                        onChange={(_event, newDistrict) => {
                            setDist(newDistrict);
                            setConc(null)
                            setFreg(null)
                            if (dist.length > 0) {
                                if (distToConcState.has(newDistrict)) {
                                    var temp = distToConcState.get(newDistrict)
                                    setAllConc(temp)
                                }
                            }
                        }}
                        getOptionSelected={(option, value) => option === value}
                        sx={{ width: 400, mt: 1 }}
                        renderInput={(params) => <TextField {...params} label="Distrito" />}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <Autocomplete
                        selectOnFocus
                        id="concelhos"
                        options={allConc}
                        getOptionLabel={option => option}
                        value={conc}
                        onChange={(_event, newConc) => {
                            setConc(newConc);
                            setFreg(null)
                            if (dist.length > 0) {
                                if (concToFregState.has(newConc)) {
                                    var temp = concToFregState.get(newConc)
                                    setAllFreg(temp)
                                }
                            }
                        }}
                        sx={{ width: 400, mt: 2 }}
                        renderInput={(params) => <TextField {...params} label="Concelho" />}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <Autocomplete
                        selectOnFocus
                        id="freguesias"
                        options={allFreg}
                        getOptionLabel={option => option}
                        value={freg}
                        onChange={(_event, newFreg) => {
                            setFreg(newFreg);
                        }}
                        sx={{ width: 400, mt: 2 }}
                        renderInput={(params) => <TextField {...params} label="Freguesia" />}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="street"
                        label="Morada"
                        value={street}
                        id="street"
                        color="success"
                        onChange={(event) => { setStreet(event.target.value) }}
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
                        onChange={(event) => { setNif(event.target.value) }}
                    />
                </Box>
                {nifErr && <Typography sx={{ color: "red", fontSize: 14 }}> Formato de NIF incorreto </Typography>}
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

                {(!loaded || showProgress) && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "40%", left: "50%", overflow: "auto" }}/>}
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