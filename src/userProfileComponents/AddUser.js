import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import locais from "../locais/distritos.txt"
import { Box, Container, Typography, TextField, Button, Grid, FormControl, Alert, Autocomplete, Select, InputLabel, MenuItem, CircularProgress } from "@mui/material";

export default function AddUser() {

    const [username, setUsername] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [name, setName] = react.useState("");
    const [role, setRole] = react.useState("");
    const [isRep, setIsRep] = react.useState(false);
    const [freg, setFreg] = react.useState([]);
    const [conc, setConc] = react.useState([]);
    const [dist, setDist] = react.useState([]);
    const [chosenFreg, setChosenFreg] = react.useState(null);
    const [chosenConc, setChosenConc] = react.useState(null);
    const [chosenDist, setChosenDist] = react.useState(null);
    const [distConcState, setDistConcState] = react.useState();
    const [concFregState, setConcFregState] = react.useState();
    const [disableConc, setDisableConc] = react.useState(true);
    const [disableFreg, setDisableFreg] = react.useState(true);

    const [emailErr, setEmailErr] = react.useState({});
    const [showRoleErr, setShowRoleErr] = react.useState(false);

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isUserRegistered, setIsUserRegistered] = react.useState(false);
    const [isUserNotRegistered, setIsUserNotRegistered] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false);

    useEffect(() => {
        let split = [];
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
                setDist(distritos)
                setConc(concelhos)
                setFreg(freguesias)
                setDistConcState(distToConc)
                setConcFregState(concToFreg)
            });
    }, [])

    function usernameHandler(e) {
        setUsername(e.target.value)
    }

    function emailHandler(e) {
        setEmail(e.target.value)
    }

    function nameHandler(e) {
        setName(e.target.value)
    }

    function fregHandler(e) {
        setFreg(e.target.value)
    }

    function roleHandler(e) {
        if (e.target.value == "REPRESENTANTE")
            setIsRep(true)
        else
            setIsRep(false)
        setRole(e.target.value)
    }

    function resetValues() {
        setChosenDist(null)
        setChosenConc(null)
        setChosenFreg(null)
        setUsername("")
        setEmail("")
        setName("")
        setRole("")
    }

    function addUserManager(e) {
        e.preventDefault();
        if (registerFormValidation) {
            setShowProgress(true)
            restCalls.registerUserSU(username, email, name, isRep, chosenDist, chosenConc, chosenFreg)
                .then(() => { setShowProgress(false); setIsUserRegistered(true); setDisplayMessage(0); resetValues() })
                .catch(() => { setShowProgress(false); setIsUserNotRegistered(true); setDisplayMessage(1) })
        }
    }

    const registerFormValidation = () => {
        const emailErr = {};
        let isValid = true;

        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null) {
            emailErr.emailWithoutValidFormat = "O e-mail deve possuir um formato válido.";
            isValid = false;
            setEmailErr(emailErr)
        }

        if (role == "") {
            setShowRoleErr(true)
            isValid = false;
        } else {
            setShowRoleErr(false)
        }

        setEmailErr(emailErr)
        return isValid;
    }

    return (
        <>
            <Grid item xs={5}>
                <Container align="left" component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 3,
                            marginBottom: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Adicionar Utilizador
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                required
                                margin="normal"
                                fullWidth
                                autoFocus
                                value={username}
                                name="username"
                                label="Nome de utilizador"
                                id="username"
                                color="success"
                                onChange={usernameHandler}
                            />
                            <TextField
                                required
                                margin="normal"
                                fullWidth
                                value={email}
                                name="email"
                                label="Email"
                                id="email"
                                color="success"
                                onChange={emailHandler}
                            />
                            {Object.keys(emailErr).map((key) => {
                                return <Typography sx={{ color: "red", fontSize: 14 }}> {emailErr[key]}</Typography>
                            })}
                            <TextField
                                required
                                margin="normal"
                                fullWidth
                                value={name}
                                name="nome"
                                label="Nome"
                                id="nome"
                                color="success"
                                onChange={nameHandler}
                            />

                            <Autocomplete
                                selectOnFocus
                                id="distritos"
                                options={dist}
                                getOptionLabel={option => option}
                                value={chosenDist}
                                onChange={(_event, newDistrict) => {
                                    setChosenDist(newDistrict);
                                    setChosenConc(null)
                                    setChosenFreg(null)
                                    if (dist.length > 0) {
                                        if (distConcState.has(newDistrict)) {
                                            var temp = distConcState.get(newDistrict)
                                            setConc(temp)
                                            setDisableConc(false)
                                        }
                                    }
                                }}
                                sx={{ width: 400, mt: 1 }}
                                renderInput={(params) => <TextField {...params} label="Distrito *" />}
                            />
                            <Autocomplete
                                disabled={disableConc}
                                selectOnFocus
                                id="concelhos"
                                options={conc}
                                getOptionLabel={option => option}
                                value={chosenConc}
                                onChange={(_event, newConc) => {
                                    setChosenConc(newConc);
                                    setChosenFreg(null)
                                    if (dist.length > 0) {
                                        if (concFregState.has(newConc)) {
                                            var temp = concFregState.get(newConc)
                                            setFreg(temp)
                                            setDisableFreg(false)
                                        }
                                    }
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Concelho *" />}
                            />
                            <Autocomplete
                                disabled={disableFreg}
                                selectOnFocus
                                id="freguesias"
                                options={freg}
                                getOptionLabel={option => option}
                                value={chosenFreg}
                                onChange={(_event, newFreg) => {
                                    setChosenFreg(newFreg);
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Freguesia *" />}
                            />

                            <FormControl sx={{ mt: 1 }} variant="standard">
                                <InputLabel id="id" sx={{ color: "green" }} >Papel</InputLabel>
                                <Select label="papel" value={role} onChange={roleHandler} sx={{ width: "250px" }}>
                                    <MenuItem value="REPRESENTANTE" label="REPRESENTANTE">
                                        Representante
                                    </MenuItem >
                                    <MenuItem value="MODERADOR" label="MODERADOR">
                                        Moderador
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {showRoleErr && <Typography sx={{ color: "red", fontSize: 14, mb: 2 }}>É obrigatório selecionar um papel.</Typography>}

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { addUserManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> criar utilizador </Typography>
                            </Button>
                        </Box>
                        {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "35%", left: "50%", overflow: "auto" }} />}

                        {isUserRegistered && (displayMessage === 0) ?
                            <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador registado com sucesso.</Typography>
                            </Alert> : <></>}
                        {isUserNotRegistered && (displayMessage === 1) ?
                            <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha no registo de utilizador. Por favor, verifique os seus dados.</Typography>
                            </Alert> : <></>}
                    </Box>

                </Container>
            </Grid>
            <Grid item xs={2.5}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                sx={{ mt: "55px" }}
            >
            </Grid>
        </>
    )
}