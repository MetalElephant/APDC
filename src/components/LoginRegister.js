import react from "react"
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel, Alert } from "@mui/material";
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

    const [isRegisterSubmit, setIsRegisterSubmit] = react.useState(false);
    const [isRegisterNotSubmit, setIsRegisterNotSubmit] = react.useState(false);
    const [isLoginSubmit, setIsLoginSubmit] = react.useState(true);
    const [displayRegisterMessage, setDisplayRegisterMessage] = react.useState(0);


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
        e.preventDefault();
        restCalls.login(username, password).then(
            () => { restCalls.userInfo().then(() => { history.push("/main") }) }).catch(() => { setIsLoginSubmit(false) })
    }

    function registerManager(e) {
        e.preventDefault();
        const isRegisterFormValid = registerFormValidation();
        if (isRegisterFormValid) {
            restCalls.register(username, password, pwdConfirmation, email, name, homePhone, mobilePhone, address, nif)
            setIsRegisterSubmit(true)
            setDisplayRegisterMessage(0)
        } else {
            setIsRegisterNotSubmit(true)
            setDisplayRegisterMessage(1)
        }
    }

    const registerFormValidation = () => {
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

        if (!pwdConfirmation.match(password) || !password.match(pwdConfirmation)) {
            passwordConfirmationErr.passwordConfirmationNotEqualToPassword = "Password confimation does not match."
            isValid = false;
        }

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
        <Grid container spacing={2} direction="column" bgcolor="white">
            <Grid item xs={12} container >
                <Grid item xs={2.5} align="center">
                    {!isLoginSubmit ?
                        <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Login não efetuado. Username ou password incorretos.</Typography>
                        </Alert> : <></>}
                </Grid>
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
                            <Typography component="h1" variant="h5" sx={{ fontSize: 28 }}>
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
                                    color="success"
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
                                    color="success"
                                    onChange={passwordHandler}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    color="success"
                                    sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                    onClick={(e) => { loginManager(e) }}
                                >
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
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
                            <Typography component="h1" variant="h5" sx={{ fontSize: 28 }}>
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
                                    color="success"
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
                                    color="success"
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
                                    color="success"
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
                                    color="success"
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
                                    color="success"
                                    onChange={nameHandler}
                                />

                                <FormControl sx={{ mt: "13px" }}>
                                    <FormLabel id="demo-radio-buttons-group-label" ><Typography color="green">Profile Visibility</Typography></FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        row
                                    >
                                        <FormControlLabel value="public" control={<Radio color="success" />} label="Public" sx={{ color: "black" }} />
                                        <FormControlLabel value="private" control={<Radio color="success" />} label="Private" sx={{ color: "black" }} />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="homePhone"
                                    label="Home Phone"
                                    type="homePhone"
                                    id="homePhone"
                                    color="success"
                                    onChange={homePhoneHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="mobilePhone"
                                    label="Mobile Phone"
                                    type="mobilePhone"
                                    id="mobilePhone"
                                    color="success"
                                    onChange={mobilePhoneHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    type="address"
                                    id="address"
                                    color="success"
                                    onChange={addressHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="nif"
                                    label="NIF"
                                    type="nif"
                                    id="nif"
                                    color="success"
                                    onChange={nifHandler}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    color="success"
                                    sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                    onClick={(e) => { registerManager(e) }}
                                >
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </Grid>
                <Grid item xs={2.5}>
                    {isRegisterSubmit && (displayRegisterMessage === 0) ?
                        (<Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador Registado com sucesso!</Typography>
                        </Alert>) : <></>}
                    {isRegisterNotSubmit && (displayRegisterMessage === 1) ?
                        (<Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Registo de utilizador não efetuado. Por favor, verifique os seus dados.</Typography>
                        </Alert>) : <></>}
                </Grid>
            </Grid>
        </Grid>
    )
}