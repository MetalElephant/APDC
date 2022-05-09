import * as React from 'react';
import react from "react"
import restCalls from "../restCalls"
import {Box, Container, Typography, TextField, Button, Grid} from "@mui/material";
import {useHistory} from "react-router-dom"

export default function LoginRegister() {
    let history = useHistory();

    const [username, setUsername] = react.useState("");
    const [password, setPassword] = react.useState("");
    const [pwdConfirmation, setPwdConfirmation] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [name, setName] = react.useState("");

    function usernameHandler(e) {
        setUsername(e.target.value);
    }

    function passwordHandler(e) {
        setPassword(e.target.value);
    }

    function pwdConfirmationHandler(e) {
        setPwdConfirmation(e.target.value);
    }

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    function nameHandler(e) {
        setName(e.target.value);
    }

    function loginManager(e) {
        e.preventDefault()
        restCalls.login(username, password).then(() => {restCalls.userInfo().then(() => {history.push("/main")})})
    }

    function registerManager(e) {
        e.preventDefault();
        if(username !== "")
        restCalls.register(username, password, pwdConfirmation, email, name);
    }
    
    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container>
            <Grid item xs={2.5} />
                <Grid item xs={3}>
                    <Container component="main" maxWidth="xs">
                        <Box
                            sx={{
                                marginTop: 4,
                                marginBottom: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Typography component="h1" variant="h5">
                                Login
                            </Typography>
                            <Box component="form" sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoFocus
                                    onChange = {usernameHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    onChange = {passwordHandler}
                                />
                                
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, height:"40px" }}
                                    onClick={(e) => { loginManager(e) }}                                >
                                    submit
                                </Button>  
                            </Box>
                        </Box>
                    </Container>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={3}>
                        <Container component="main" maxWidth="xs">
                            <Box
                                sx={{
                                    marginTop: 4,
                                    marginBottom: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                            <Typography component="h1" variant="h5">
                                User Registration
                            </Typography>
                            <Box component="form" sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    inputProps={{ pattern: "{5,20}" }}
                                    autoFocus
                                    onChange = {usernameHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    inputProps={{ pattern: "(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" }}
                                    onChange = {passwordHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="passwordConfirmation"
                                    label="Password Confirmation"
                                    type="password"
                                    id="passwordConfirmation"
                                    onChange = {pwdConfirmationHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    id="email"
                                    inputProps={{ pattern: "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/" }}
                                    onChange = {emailHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    type="name"
                                    id="name"
                                    onChange = {nameHandler}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, height:"40px" }}
                                    onClick={(e) => { registerManager(e) }} 
                                >
                                    submit
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Grid>  
            </Grid> 
        </Grid>
    )
  }