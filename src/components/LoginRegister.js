import react from "react"
import { useState, useEffect } from "react";
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid} from "@mui/material";
import { useHistory } from "react-router-dom"

export default function LoginRegister() {
    let history = useHistory();

    const [username, setUsername] = react.useState("");
    const [password, setPassword] = react.useState("");
    const [pwdConfirmation, setPwdConfirmation] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [name, setName] = react.useState("");
    const [homePhone, setHomePhone] = react.useState("");
    const [mobilePhone, setMobilePhone] = react.useState("");
    const [address, setAddress] = react.useState("");
    const [nif, setNif] = react.useState("");

    const [usernameErr, setUsernameErr] = react.useState({});
    const [passwordErr, setPasswordErr] = react.useState({});
    const [passwordConfirmationErr, setPasswordConfirmationErr] = react.useState({});
    const [emailErr, setEmailErr] = react.useState({});


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

    function homePhoneHandler(e) {
        setHomePhone(e.target.value);
    }

    function mobilePhoneHandler(e) {
        setMobilePhone(e.target.value);
    }

    function addressHandler(e) {
        setAddress(e.target.value);
    }

    function nifHandler(e) {
        setNif(e.target.value);
    }

    function loginManager(e) {
        e.preventDefault()
        restCalls.login(username, password).then(() => { restCalls.userInfo().then(() => { history.push("/main") }) })
    }

    function registerManager(e) {
        e.preventDefault();
        //if(username !== "")
        const isValid = formValidation();
        restCalls.register(username, password, pwdConfirmation, email, name, homePhone, mobilePhone, address, nif);
    }

    const formValidation = () => {
        const usernameErr = {};
        const passwordErr = {};
        const passwordConfirmationErr = {};
        const emailErr = {};
        let isValid = true;

        if (username.length < 5 || username.length > 40) {
            usernameErr.usernameTooLongOrTooShort = "Username too long or too short.";
            isValid = false;
        }

        if (password.length < 5) {
            passwordErr.passwordTooShort = "Password must contain at least 5 characters.";
            isValid = false;
        }

        if (password.match(/[A-Z]/) == null) {
            passwordErr.passwordWithoutCapitalLetter = "Password must contain at least 1 capital letter.";
            isValid = false;
        }

        if (password.match(/[0-9]/) == null) {
            passwordErr.passwordWithoutNumber = "Password must contain at least 1 number.";
            isValid = false;
        }

        if (password.match(/[$&+,:;=?@#|'<>.*()%!-]/) == null) {
            passwordErr.passwordWithoutSpecialCharacter = "Password must contain at least 1 special character.";
            isValid = false;
        }

        if (!pwdConfirmation.match(password) || !password.match(pwdConfirmation))
            passwordConfirmationErr.passwordConfirmationNotEqualToPassword = "Password confimation does not match."
            isValid = false;

        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null) {
            emailErr.emailWithoutValidFormat = "Email must be of a valid format.";
            isValid = false;
        }

        setUsernameErr(usernameErr)
        setEmailErr(emailErr)
        setPasswordConfirmationErr(passwordConfirmationErr)
        setPasswordErr(passwordErr)
        return isValid;
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
                                    onChange={usernameHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    onChange={passwordHandler}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, height: "40px" }}
                                    onClick={(e) => { loginManager(e) }}
                                >
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
                                    autoFocus
                                    value={username}
                                    onChange={usernameHandler}
                                />
                                {Object.keys(usernameErr).map((key) => {
                                        return <Typography sx={{ color: "red", fontSize: 14 }}> {usernameErr[key]}</Typography>
                                })}

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={passwordHandler}
                                />
                                {Object.keys(passwordErr).map((key) => {
                                    return <Typography sx={{ color: "red", fontSize: 14 }}> {passwordErr[key]}</Typography>
                                })}
    
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="passwordConfirmation"
                                    label="Password Confirmation"
                                    type="password"
                                    id="passwordConfirmation"
                                    value={pwdConfirmation}
                                    onChange={pwdConfirmationHandler}
                                />
                                {Object.keys(passwordConfirmationErr).map((key) => {
                                        return <Typography sx={{ color: "red", fontSize: 14 }}> {passwordConfirmationErr[key]}</Typography>
                                })}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={emailHandler}
                                />
                                {Object.keys(emailErr).map((key) => {
                                    return <Typography sx={{ color: "red", fontSize: 14 }}> {emailErr[key]}</Typography>
                                })}
                               
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="name"
                                    label="Name"
                                    type="name"
                                    id="name"
                                    onChange={nameHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="homePhone"
                                    label="Home Phone"
                                    type="homePhone"
                                    id="homePhone"
                                    onChange={homePhoneHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="mobilePhone"
                                    label="Mobile Phone"
                                    type="mobilePhone"
                                    id="mobilePhone"
                                    onChange={mobilePhoneHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    type="address"
                                    id="address"
                                    onChange={addressHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="nif"
                                    label="NIF"
                                    type="nif"
                                    id="nif"
                                    onChange={nifHandler}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, height: "40px" }}
                                    onClick={(e) => { registerManager(e) }}
                                >
                                    submit
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
                <Grid item xs={2.5}>
                </Grid>
            </Grid>
        </Grid>
    )
}
