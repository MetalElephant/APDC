import react from "react"
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, CircularProgress, FormControl, Alert, Autocomplete, Card, Select, InputLabel, MenuItem } from "@mui/material";
import { useHistory } from "react-router-dom"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useEffect } from "react";
import locais from "../locais/distritos.txt"

export default function LoginRegister() {
    let history = useHistory();

    const [usernameLogin, setUsernameLogin] = react.useState("");
    const [usernameRegister, setUsernameRegister] = react.useState("");
    const [passwordLogin, setPasswordLogin] = react.useState("");
    const [passwordRegister, setPasswordRegister] = react.useState("");
    const [pwdConfirmation, setPwdConfirmation] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [name, setName] = react.useState("");
    const [homePhone, setHomePhone] = react.useState("");
    const [mobilePhone, setMobilePhone] = react.useState("");
    const [street, setStreet] = react.useState("");
    const [nif, setNif] = react.useState("");
    const [code, setCode] = react.useState("");
    const [role, setRole] = react.useState("");
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
    const [showRoleErr, setShowRoleErr] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false);

    const [image, setImage] = react.useState();
    const [preview, setPreview] = react.useState();
    const [imageArray, setImageArray] = react.useState();
    const fileInputRef = react.useRef();

    const [nUsers, setNUsers] = react.useState("")
    const [nParcels, setNParcels] = react.useState("")


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

    useEffect(() => {
        restCalls.numberOfUsersStatistics();
        var numberUsers = JSON.parse(localStorage.getItem('numberOfUsers'))
        setNUsers(numberUsers)

        restCalls.numberOfParcelsStatistics();
        var numberParcels = JSON.parse(localStorage.getItem('numberOfParcels'))
        setNParcels(numberParcels)

        restCalls.numberOfForumsStatistics();
        restCalls.numberOfMessagesStatistics();
    }, [])

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

    function nameHandler(e) {
        setName(e.target.value);
    }

    function homePhoneHandler(e) {
        setHomePhone(e.target.value);
    }

    function mobilePhoneHandler(e) {
        setMobilePhone(e.target.value);
    }

    function streetHandler(e) {
        setStreet(e.target.value);
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
            case "PROPRIETARIO":
                history.push("/proprietario")
                break;
            case "COMERCIANTE":
                history.push("/comerciante")
                break;
            case "REPRESENTANTE":
                history.push("/representante")
                break;
            case "MODERADOR":
                history.push("/moderador")
                break;
            case "SUPERUSER":
                history.push("/superuser")
                break;
            default:
                break;
        }
    }

    function loginManager(e) {
        e.preventDefault();
        setShowProgress(true)
        restCalls.login(usernameLogin, passwordLogin)
            .then(() => { restCalls.userInfo().then(() => { switchForRole() }) })
            .catch(() => { setIsLoginSubmit(false); setShowProgress(false) })
    }

    function registerManager(e) {
        e.preventDefault();
        const isRegisterFormValid = registerFormValidation();
        if (isRegisterFormValid) {
            setShowProgress(true)
            restCalls.register(usernameRegister, passwordRegister, pwdConfirmation, email, name, homePhone, mobilePhone, nif, imageArray, role, chosenDist, chosenConc, chosenFreg, street, code)
                .then(() => { resetRegisterValues(); setShowProgress(false); setIsRegisterSubmit(true); setDisplayRegisterMessage(0) })
                .catch(() => { setShowProgress(false); setIsRegisterNotSubmit(true); setDisplayRegisterMessage(1) })
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
        setHomePhone("");
        setMobilePhone("");
        setStreet("");
        setNif("");
        setRole("");
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
            usernameErr.usernameTooLongOrTooShort = "Username demasiado curto ou demasiado longo.";
            isValid = false;
            setUsernameErr(usernameErr)
        }

        if (passwordRegister.length < 5) {
            passwordErr.passwordTooShort = "Password deve conter pelo menos 5 caracteres.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (passwordRegister.match(/[A-Z]/) == null) {
            passwordErr.passwordWithoutCapitalLetter = "Password deve conter pelo menos uma letra maiúscula.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (passwordRegister.match(/[0-9]/) == null) {
            passwordErr.passwordWithoutNumber = "Password deve conter pelo menos um número.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (passwordRegister.match(/[$&+,:;=?@#|'<>.*()%!-]/) == null) {
            passwordErr.passwordWithoutSpecialCharacter = "Password deve conter pelo menos um caracter especial.";
            isValid = false;
            setPasswordErr(passwordErr)
        }

        if (!pwdConfirmation.match(passwordRegister) || !passwordRegister.match(pwdConfirmation)) {
            passwordConfirmationErr.passwordConfirmationNotEqualToPassword = "Confirmação deve ser igual a Palavra-passe."
            isValid = false;
            setPasswordConfirmationErr(passwordConfirmationErr)
        }

        if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null) {
            emailErr.emailWithoutValidFormat = "O e-mail deve possuir um formato válido.";
            isValid = false;
            setEmailErr(emailErr)
        }

        if ((homePhone.length > 0) && (homePhone.length !== 9)) {
            homePhoneErr.not9Digits = "Número de telefone fixo não é composto por 9 dígitos."
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if ((homePhone.match(/[a-zA-Z]/) != null) || (homePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) {
            homePhoneErr.onlyNumbers = "Número de telefone fixo não pode conter letras ou caracteres especiais."
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if ((mobilePhone.length > 0) && (mobilePhone.length !== 9)) {
            mobilePhoneErr.not9Digits = "Número de telemóvel não é composto por 9 dígitos."
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if ((mobilePhone.match(/[a-zA-Z]/) != null) || (mobilePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) {
            mobilePhoneErr.onlyNumbers = "Número de telemóvel não pode conter letras ou caracteres especiais."
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if ((nif.length > 0) && (nif.length !== 9)) {
            nifErr.not9Digits = "NIF não é composto por 9 dígitos."
            isValid = false;
            setNifErr(nifErr)
        }

        if ((nif.match(/[a-zA-Z]/) != null) || (nif.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) {
            nifErr.onlyNumbers = "NIF não pode conter letras ou caracteres especiais."
            isValid = false;
            setNifErr(nifErr)
        }

        if (role == "") {
            setShowRoleErr(true)
            isValid = false;
        } else {
            setShowRoleErr(false)
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
                                Número de utilizadores registados no sistema: {nUsers}
                            </Typography>
                        </Card>
                    </Box>
                    <Box sx={{ p: 4 }}>
                        <Card raised sx={{ p: 1 }} >
                            <Typography variant="h5" sx={{ fontSize: 12 }}>
                                Número de parcelas registadas no sistema: {nParcels}
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
                                    label="Nome de Utilizador"
                                    name="username"
                                    color="success"
                                    onChange={usernameLoginHandler}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Palavra-passe"
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
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Fazer Login </Typography>
                                </Button>

                                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "35%", left: "50%", overflow: "auto" }} />}

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
                                Registo de Utilizador
                            </Typography>
                            <Box component="form" sx={{ mt: 1 }}>

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Nome de Utilizador"
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
                                    label="Palavra-passe"
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
                                    label="Confirmação Palavra-passe"
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
                                    label="Nome"
                                    value={name}
                                    type="name"
                                    id="name"
                                    color="success"
                                    onChange={nameHandler}
                                />

                                <FormControl sx={{ mb: 2 }} variant="standard">
                                    <InputLabel id="id" sx={{ color: "green" }} >Papel</InputLabel>
                                    <Select label="role" value={role} onChange={roleHandler} sx={{ width: "250px" }}>
                                        <MenuItem value="PROPRIETARIO" label="PROPRIETARIO">
                                            Proprietário
                                        </MenuItem >
                                        <MenuItem value="COMERCIANTE" label="COMERCIANTE">
                                            Comerciante
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                {showRoleErr && <Typography sx={{ color: "red", fontSize: 14, mb: 2 }}>É obrigatório selecionar um papel.</Typography>}

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
                                                Adicionar Foto de Perfil
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

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="street"
                                    label="Morada"
                                    type="street"
                                    value={street}
                                    id="street"
                                    color="success"
                                    onChange={streetHandler}
                                />

                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="mobilePhone"
                                    label="Número de telemóvel"
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
                                    label="Número de telefone"
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
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Criar Utilizador </Typography>
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