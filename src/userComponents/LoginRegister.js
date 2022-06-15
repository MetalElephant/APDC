import react from "react"
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel, Alert, inputAdornmentClasses, Card, Select, InputLabel, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect } from "react";

export default function LoginRegister() {
    let history = useHistory();

    const [usernameLogin, setUsernameLogin] = react.useState("");
    const [usernameRegister, setUsernameRegister] = react.useState("");
    const [passwordLogin, setPasswordLogin] = react.useState("");
    const [passwordRegister, setPasswordRegister] = react.useState("");
    const [pwdConfirmation, setPwdConfirmation] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [visibility, setVisibility] = react.useState("Public");
    const [name, setName] = react.useState("");
    const [homePhone, setHomePhone] = react.useState("");
    const [mobilePhone, setMobilePhone] = react.useState("");
    const [address, setAddress] = react.useState("");
    const [nif, setNif] = react.useState("");
    const [role, setRole] = react.useState("");

    const [usernameErr, setUsernameErr] = react.useState({});
    const [passwordErr, setPasswordErr] = react.useState({});
    const [passwordConfirmationErr, setPasswordConfirmationErr] = react.useState({});
    const [emailErr, setEmailErr] = react.useState({});
    const [homePhoneErr, setHomePhoneErr] = react.useState({});
    const [mobilePhoneErr, setMobilePhoneErr] = react.useState({});
    const [nifErr, setNifErr] = react.useState({});

    const [isRegisterSubmit, setIsRegisterSubmit] = react.useState(false);
    const [isRegisterNotSubmit, setIsRegisterNotSubmit] = react.useState(false);
    const [isLoginSubmit, setIsLoginSubmit] = react.useState(true);
    const [displayRegisterMessage, setDisplayRegisterMessage] = react.useState(0);

    const [showPasswordLogin, setShowPasswordLogin] = react.useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = react.useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = react.useState(false);


    const [image, setImage] = react.useState();
    const [preview, setPreview] = react.useState();
    const [imageArray, setImageArray] = react.useState();
    const fileInputRef = react.useRef();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            }
            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }
    }, [image]);

    function usernameLoginHandler(e) {
        setUsernameLogin(e.target.value);
    }

    function usernameRegisterHandler(e) {
        setUsernameRegister(e.target.value);
    }

    function passwordLoginHandler(e) {
        setPasswordLogin(e.target.value);
    }

    function passwordRegisterHandler(e) {
        setPasswordRegister(e.target.value);
    }

    function pwdConfirmationHandler(e) {
        setPwdConfirmation(e.target.value);
    }

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    function visibilityHandler(e) {
        setVisibility(e.target.value);
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

    function roleHandler(e) {
        setRole(e.target.value);
    }

    function switchForRole() {
        var roleType = JSON.parse(localStorage.getItem('user')).role
        switch (roleType) {
            case "Proprietário":
                history.push("/main")
                break;
            case "Comerciante":
                history.push("/merchants")
                break;
            case "Autarca":
                history.push("/mayors")
                break;
            default:
                break;
        }
    }

    function loginManager(e) {
        e.preventDefault();
        restCalls.login(usernameLogin, passwordLogin).then(() => { restCalls.userInfo().then(() => { switchForRole() }) }).catch(() => { setIsLoginSubmit(false) })
    }

    function registerManager(e) {
        e.preventDefault();
        const isRegisterFormValid = registerFormValidation();
        if (isRegisterFormValid) {
            restCalls.register(usernameRegister, passwordRegister, pwdConfirmation, email, visibility, name, homePhone, mobilePhone, address, nif, imageArray, role)
                .then(() => resetRegisterValues())
            setIsRegisterSubmit(true)
            setDisplayRegisterMessage(0)
        } else {
            setIsRegisterNotSubmit(true)
            setDisplayRegisterMessage(1)
        }

    }

    function loadPhoto(f) {
        const reader = new FileReader();
        const fileByteArray = [];

        reader.readAsArrayBuffer(f);
        reader.onloadend = (evt) => {
            if (evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result,
                    array = new Uint8Array(arrayBuffer);
                for (const a of array) {
                    fileByteArray.push(a);
                }
                setImageArray(fileByteArray)
            }
        }
    }

    function resetRegisterValues() {
        setUsernameRegister("");
        setPasswordRegister("");
        setPwdConfirmation("");
        setEmail("");
        setName("");
        setVisibility("Public");
        setHomePhone("");
        setMobilePhone("");
        setAddress("");
        setNif("");
    }

    const registerFormValidation = () => {
        const usernameErr = {};
        const passwordErr = {};
        const passwordConfirmationErr = {};
        const emailErr = {};
        const homePhoneErr = {};
        const mobilePhoneErr = {};
        const nifErr = {};
        let isValid = true;

        if (usernameRegister.length < 5 || usernameRegister.length > 40) {
            usernameErr.usernameTooLongOrTooShort = "Username too long or too short.";
            isValid = false;
            setUsernameErr(usernameErr)
        }

        if (passwordRegister.length < 5) {
            passwordErr.passwordTooShort = "Password must contain at least 5 characters.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (passwordRegister.match(/[A-Z]/) == null) {
            passwordErr.passwordWithoutCapitalLetter = "Password must contain at least 1 capital letter.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (passwordRegister.match(/[0-9]/) == null) {
            passwordErr.passwordWithoutNumber = "Password must contain at least 1 number.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (passwordRegister.match(/[$&+,:;=?@#|'<>.*()%!-]/) == null) {
            passwordErr.passwordWithoutSpecialCharacter = "Password must contain at least 1 special character.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (!pwdConfirmation.match(passwordRegister) || !passwordRegister.match(pwdConfirmation)) {
            passwordConfirmationErr.passwordConfirmationNotEqualToPassword = "Password confimation does not match."
            isValid = false;
            setPasswordConfirmationErr(passwordConfirmationErr)
        }

        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null) {
            emailErr.emailWithoutValidFormat = "Email must be of a valid format.";
            isValid = false;
            setEmailErr(emailErr)
        }

        if ((homePhone.length > 0) && (homePhone.length !== 9)) {
            homePhoneErr.not9Digits = "Home phone is not composed of nine digits."
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if ((homePhone.match(/[a-zA-Z]/) != null) || (homePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) {
            homePhoneErr.onlyNumbers = "Home phone must not contain any letters or special characters."
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if ((mobilePhone.length > 0) && (mobilePhone.length !== 9)) {
            mobilePhoneErr.not9Digits = "Mobile phone is not composed of nine digits."
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if ((mobilePhone.match(/[a-zA-Z]/) != null) || (mobilePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) {
            mobilePhoneErr.onlyNumbers = "Mobile phone must not contain any letters or special characters."
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if ((nif.length > 0) && (nif.length !== 9)) {
            nifErr.not9Digits = "NIF is not composed of nine digits."
            isValid = false;
            setNifErr(nifErr)
        }

        if ((nif.match(/[a-zA-Z]/) != null) || (nif.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) {
            nifErr.onlyNumbers = "NIF must not contain any letters or special characters."
            isValid = false;
            setNifErr(nifErr)
        }

        setUsernameErr(usernameErr)
        setEmailErr(emailErr)
        setPasswordConfirmationErr(passwordConfirmationErr)
        setPasswordErr(passwordErr)
        setHomePhoneErr(homePhoneErr)
        setMobilePhoneErr(mobilePhoneErr)
        setNifErr(nifErr)
        return isValid;
    }

    const toggleVisibilityLoginIcon = () => {
        setShowPasswordLogin(!showPasswordLogin)
    }

    const toggleVisibilityFirstRegisterIcon = () => {
        setShowPasswordRegister(!showPasswordRegister)
    }

    const toggleVisibilitySecondRegisterIcon = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation)
    }

    return (
        <Grid container spacing={2} direction="column" bgcolor="white">
            <Grid item xs={12} container >
                <Grid item xs={2.5} align="center">
                    <Box sx={{ p: 4 }}>
                        <Card raised sx={{ p: 1 }}>
                            <Typography variant="h5" sx={{ fontSize: 12 }}>
                                Número de utilizadores registados no sistema: 25
                            </Typography>
                        </Card>
                    </Box>
                    <Box sx={{ p: 4 }}>
                        <Card raised sx={{ p: 1 }} >
                            <Typography variant="h5" sx={{ fontSize: 12 }}>
                                Número de parcelas registadas no sistema: 83
                            </Typography>
                        </Card>
                    </Box>
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
                                    onChange={usernameLoginHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPasswordLogin ? "text" : "password"}
                                    id="password"
                                    color="success"
                                    InputProps={showPasswordLogin ? {
                                        endAdornment: <Button onClick={toggleVisibilityLoginIcon}>
                                            <RemoveRedEyeIcon sx={{ color: "black" }} />
                                        </Button>
                                    } : {
                                        endAdornment: <Button onClick={toggleVisibilityLoginIcon}>
                                            <VisibilityOffIcon sx={{ color: "black" }} />
                                        </Button>
                                    }}
                                    onChange={passwordLoginHandler}
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
                            {!isLoginSubmit ?
                                <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Login não efetuado. Username ou password incorretos.</Typography>
                                </Alert> : <></>}
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
                                    value={usernameRegister}
                                    autoFocus
                                    color="success"
                                    onChange={usernameRegisterHandler}
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
                                    value={passwordRegister}
                                    type={showPasswordRegister ? "text" : "password"}
                                    id="password"
                                    color="success"
                                    InputProps={showPasswordRegister ? {
                                        endAdornment: <Button onClick={toggleVisibilityFirstRegisterIcon}>
                                            <RemoveRedEyeIcon sx={{ color: "black" }} />
                                        </Button>
                                    } : {
                                        endAdornment: <Button onClick={toggleVisibilityFirstRegisterIcon}>
                                            <VisibilityOffIcon sx={{ color: "black" }} />
                                        </Button>
                                    }}
                                    onChange={passwordRegisterHandler}
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
                                    value={pwdConfirmation}
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    id="passwordConfirmation"
                                    color="success"
                                    InputProps={showPasswordConfirmation ? {
                                        endAdornment: <Button onClick={toggleVisibilitySecondRegisterIcon}>
                                            <RemoveRedEyeIcon sx={{ color: "black" }} />
                                        </Button>
                                    } : {
                                        endAdornment: <Button onClick={toggleVisibilitySecondRegisterIcon}>
                                            <VisibilityOffIcon sx={{ color: "black" }} />
                                        </Button>
                                    }}
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
                                    value={email}
                                    id="email"
                                    color="success"
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
                                    value={name}
                                    type="name"
                                    id="name"
                                    color="success"
                                    onChange={nameHandler}
                                />

                                <FormControl variant="standard">
                                    <InputLabel id="id" sx={{ color: "green" }} >Role</InputLabel>
                                    <Select label="role" value={role} onChange={roleHandler} sx={{ width: "250px" }}>
                                        <MenuItem value="Proprietário" label="Proprietário">
                                            Proprietário
                                        </MenuItem >
                                        <MenuItem value="Comerciante" label="Comerciante">
                                            Comerciante
                                        </MenuItem>
                                        <MenuItem value="Autarca" label="Autarca">
                                            Autarca
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl sx={{ mt: "13px", pb: 1 }}>
                                    <FormLabel id="demo-radio-buttons-group-label" ><Typography color="green">Profile Visibility</Typography></FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radio-buttons-group"
                                        row
                                        defaultValue="Public"
                                        onChange={visibilityHandler}
                                    >
                                        <FormControlLabel value="Public" control={<Radio color="success" />} label="Public" sx={{ color: "black" }} />
                                        <FormControlLabel value="Private" control={<Radio color="success" />} label="Private" sx={{ color: "black" }} />
                                    </RadioGroup>
                                </FormControl>



                                <div>
                                    <form>
                                        {preview ? (
                                            <img
                                                src={preview}
                                                style={{ objectFit: "cover", width: "200px", height: "200px", borderRadius: "70%", cursor: "pointer" }}
                                                onClick={() => {
                                                    setImage(null);
                                                }}
                                            />
                                        ) : (
                                            <button
                                                style={{ width: "200px", height: "200px", borderRadius: "70%", cursor: "pointer" }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    fileInputRef.current.click();
                                                }}
                                            >
                                                Add Profile Picture
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            style={{ display: "none" }}
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file && file.type.substring(0, 5) === "image") {
                                                    setImage(file);
                                                    loadPhoto(file);
                                                } else {
                                                    setImage(null);
                                                }
                                            }}
                                        />

                                    </form>
                                </div>

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="mobilePhone"
                                    label="Mobile Phone"
                                    type="mobilePhone"
                                    value={mobilePhone}
                                    id="mobilePhone"
                                    color="success"
                                    onChange={mobilePhoneHandler}
                                />
                                {Object.keys(mobilePhoneErr).map((key) => {
                                    return <Typography sx={{ color: "red", fontSize: 14 }}> {mobilePhoneErr[key]}</Typography>
                                })}
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="homePhone"
                                    label="Home Phone"
                                    value={homePhone}
                                    type="homePhone"
                                    id="homePhone"
                                    color="success"
                                    onChange={homePhoneHandler}
                                />
                                {Object.keys(homePhoneErr).map((key) => {
                                    return <Typography sx={{ color: "red", fontSize: 14 }}> {homePhoneErr[key]}</Typography>
                                })}
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="address"
                                    label="Address"
                                    type="address"
                                    value={address}
                                    id="address"
                                    color="success"
                                    onChange={addressHandler}
                                />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="nif"
                                    label="NIF"
                                    value={nif}
                                    type="nif"
                                    id="nif"
                                    color="success"
                                    onChange={nifHandler}
                                />
                                {Object.keys(nifErr).map((key) => {
                                    return <Typography sx={{ color: "red", fontSize: 14 }}> {nifErr[key]}</Typography>
                                })}

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