import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel, Alert, Card, Select, InputLabel, MenuItem } from "@mui/material";

export default function AddUser() {

    const [username, setUsername] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [name, setName] = react.useState("");
    const [visibility, setVisibility] = react.useState("Public");
    const [role, setRole] = react.useState("");
    const [isRep, setIsRep] = react.useState(false);
    const [freg, setFreg] = react.useState(null);

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isUserRegistered, setIsUserRegistered] = react.useState(false);
    const [isUserNotRegistered, setIsUserNotRegistered] = react.useState(false);

    function usernameHandler(e) {
        setUsername(e.target.value)
    }

    function emailHandler(e) {
        setEmail(e.target.value)
    }

    function nameHandler(e) {
        setName(e.target.value)
    }

    function visibilityHandler(e) {
        setVisibility(e.target.value)
    }

    function fregHandler(e) {
        setFreg(e.target.value)
    }

    function roleHandler(e) {
        if (e.target.value == "Representante")
            setIsRep(true)
        else
            setIsRep(false)
        setRole(e.target.value)
    }

    function addUserManager(e) {
        e.preventDefault();
        restCalls.registerUserSU(username, email, name, visibility, isRep, freg).then(() => { setIsUserRegistered(true); setDisplayMessage(0) }).catch(() => { setIsUserNotRegistered(true); setDisplayMessage(1) })
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
                            <FormControl sx={{ mt: "13px", pb: 1 }}>
                                <FormLabel id="demo-radio-buttons-group-label" ><Typography color="green">Visibilidade de Perfil</Typography></FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                    row
                                    value={visibility}
                                    onChange={visibilityHandler}
                                >
                                    <FormControlLabel value="Public" control={<Radio color="success" />} label="Público" sx={{ color: "black" }} />
                                    <FormControlLabel value="Private" control={<Radio color="success" />} label="Privado" sx={{ color: "black" }} />
                                </RadioGroup>
                            </FormControl>

                            <FormControl variant="standard">
                                <InputLabel id="id" sx={{ color: "green" }} >Papel</InputLabel>
                                <Select label="papel" value={role} onChange={roleHandler} sx={{ width: "250px" }}>
                                    <MenuItem value="Representante" label="Representante">
                                        Representante
                                    </MenuItem >
                                    <MenuItem value="Moderador" label="Moderador">
                                        Moderador
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            {isRep &&
                                <TextField
                                    required
                                    margin="normal"
                                    fullWidth
                                    value={freg}
                                    name="freg"
                                    label="Freguesia"
                                    id="freg"
                                    color="success"
                                    onChange={fregHandler}
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