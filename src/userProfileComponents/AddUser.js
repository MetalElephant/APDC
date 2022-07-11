import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import locais from "../locais/distritos.txt"
import { Box, Container, Typography, TextField, Button, Grid, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel, Alert, Autocomplete, Select, InputLabel, MenuItem } from "@mui/material";

export default function AddUser() {

    const [username, setUsername] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [name, setName] = react.useState("");
    const [role, setRole] = react.useState("");
    const [isRep, setIsRep] = react.useState(false);
    const [freg, setFreg] = react.useState(null);
    const [allFregs, setAllFregs] = react.useState([]);

    const [emailErr, setEmailErr] = react.useState({});
    const [showRoleErr, setShowRoleErr] = react.useState(false);

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isUserRegistered, setIsUserRegistered] = react.useState(false);
    const [isUserNotRegistered, setIsUserNotRegistered] = react.useState(false);

    useEffect(() => {
        var split = []
        var temp = []
        fetch(locais)
            .then(r => r.text())
            .then(text => {
                split = text.split(";")
                for (let i = 2; i < split.length; i += 3) {
                    var elem = split[i]
                    if (temp.indexOf(elem) === -1)
                        temp.push(elem)
                }
                setAllFregs(temp)
            })
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

    function addUserManager(e) {
        e.preventDefault();
        const isRegisterFormValid = registerFormValidation();
        if (isRegisterFormValid) {
            restCalls.registerUserSU(username, email, name, isRep, freg).then(() => { setIsUserRegistered(true); setDisplayMessage(0) }).catch(() => { setIsUserNotRegistered(true); setDisplayMessage(1) })
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

                            <FormControl sx={{ mb: 2 }} variant="standard">
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

                            {isRep &&
                                <Autocomplete
                                    selectOnFocus
                                    id="freguesias"
                                    options={allFregs}
                                    getOptionLabel={option => option}
                                    value={freg}
                                    onChange={(_event, newFreg) => {
                                        setFreg(newFreg);
                                    }}
                                    sx={{ width: 400, mt: 2 }}
                                    renderInput={(params) => <TextField {...params} label="Freguesia *" />}
                                />
                            }

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