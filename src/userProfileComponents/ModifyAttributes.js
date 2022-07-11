import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, CircularProgress, Alert } from "@mui/material";

export default function ModifyAttributes() {

    const [name, setName] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [homePhone, setHomePhone] = react.useState("");
    const [mobilePhone, setMobilePhone] = react.useState("");
    const [street, setStreet] = react.useState("");
    const [nif, setNif] = react.useState("");
    const [image, setImage] = react.useState();
    const [preview, setPreview] = react.useState();
    const [imageArray, setImageArray] = react.useState();
    const fileInputRef = react.useRef();

    const [emailErr, setEmailErr] = react.useState({});
    const [homePhoneErr, setHomePhoneErr] = react.useState({});
    const [mobilePhoneErr, setMobilePhoneErr] = react.useState({});
    const [nifErr, setNifErr] = react.useState({});


    const [displayMessage, setDisplayMessage] = react.useState(0);
    const [userModified, setUserModified] = react.useState(false);
    const [userNotModified, setUserNotModified] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false);

    var user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        setEmail(user.email);
        setName(user.name);
        setHomePhone(user.landphone);
        setMobilePhone(user.mobilephone);
        setStreet(user.street);
        setNif(user.nif);
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

    function nameHandler(e) {
        setName(e.target.value);
    }

    function emailHandler(e) {
        setEmail(e.target.value);
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

    function modifyAttributesManager(e) {
        e.preventDefault();
        const isModifyUserFormValid = modifyUserFormValidation();

        if (isModifyUserFormValid) {
            setShowProgress(true)
            restCalls.modifyUserAttributes(JSON.parse(localStorage.getItem('token')).username, name, email, street, homePhone, mobilePhone, nif, imageArray)
                .then(() => { restCalls.userInfo().then(() => { setShowProgress(false); setUserModified(true); setDisplayMessage(0) }) })
                .catch(() => { setShowProgress(false); setUserNotModified(true); setDisplayMessage(1) })
        } else {
            setUserNotModified(true);
            setDisplayMessage(1);
        }
    }

    const modifyUserFormValidation = () => {
        const emailErr = {};
        const homePhoneErr = {};
        const mobilePhoneErr = {};
        const nifErr = {};
        let isValid = true;

        if ((email.length > 0) && (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null)) {
            emailErr.emailWithoutValidFormat = "O Email tem de ter um formato válido.";
            isValid = false;
            setEmailErr(emailErr)
        }

        if ((homePhone.length > 0) && (homePhone.length !== 9) && (homePhone.toUpperCase() !== "NÃO DEFINIDO")) {
            homePhoneErr.not9Digits = "Este número não é composto por 9 dígitos"
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if (((homePhone.match(/[a-zA-Z]/) != null) || (homePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) && (homePhone.toUpperCase() !== "NÃO DEFINIDO")) {
            homePhoneErr.onlyNumbers = "Este número não pode conter letras ou caracteres especiais"
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }
        if ((mobilePhone.length > 0) && (mobilePhone.length !== 9) && (mobilePhone.toUpperCase() !== "NÃO DEFINIDO")) {
            mobilePhoneErr.not9Digits = "Este número não é composto por 9 dígitos"
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if (((mobilePhone.match(/[a-zA-Z]/) != null) || (mobilePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) && (mobilePhone.toUpperCase() !== "NÃO DEFINIDO")) {
            mobilePhoneErr.onlyNumbers = "Este número não pode conter letras ou caracteres especiais"
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }


        if ((nif.length > 0) && (nif.length !== 9) && nif.toUpperCase() !== "NÃO DEFINIDO") {
            nifErr.not9Digits = "Este NIF não é composto por 9 dígitos"
            isValid = false;
            setNifErr(nifErr)
        }

        if (((nif.match(/[a-zA-Z]/) != null) || (nif.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null)) && nif.toUpperCase() !== "NÃO DEFINIDO") {
            nifErr.onlyNumbers = "O NIF não pode conter letras ou caracteres especiais"
            isValid = false;
            setNifErr(nifErr)
        }

        setEmailErr(emailErr)
        setHomePhoneErr(homePhoneErr)
        setMobilePhoneErr(mobilePhoneErr)
        setNifErr(nifErr)

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
                            Modificação de Atributos
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                autoFocus
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
                                margin="normal"
                                fullWidth
                                id="nome"
                                label="Nome"
                                value={name}
                                name="nome"
                                color="success"
                                onChange={nameHandler}
                            />

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
                            {Object.keys(homePhoneErr).map((key) => {
                                return <Typography sx={{ color: "red", fontSize: 14 }}> {homePhoneErr[key]}</Typography>
                            })}

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
                            {Object.keys(mobilePhoneErr).map((key) => {
                                return <Typography sx={{ color: "red", fontSize: 14 }}> {mobilePhoneErr[key]}</Typography>
                            })}
                            <TextField
                                margin="normal"
                                fullWidth
                                name="street"
                                label="Morada"
                                value={street}
                                id="street"
                                color="success"
                                onChange={streetHandler}
                            />
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
                            {Object.keys(nifErr).map((key) => {
                                return <Typography sx={{ color: "red", fontSize: 14 }}> {nifErr[key]}</Typography>
                            })}

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { modifyAttributesManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Submeter </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
            <Grid item xs={2.5}
                container
                spacing={0}
                direction="column"
                alignItems="left"
                sx={{ mt: "50px" }}
            >
                <div>
                    <form>
                        {preview ? (
                            <img
                                src={preview}
                                style={{ objectFit: "cover", width: "200px", height: "200px", borderRadius: "70%", cursor: "pointer" }}
                                onClick={() => {
                                    setImage();
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
                                Alterar Foto de Perfil
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

                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }} />}

                <Box sx={{ mt: "50px" }}>
                    {userModified && (displayMessage === 0) ?
                        <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador modificado com sucesso.</Typography>
                        </Alert> : <></>
                    }
                    {userNotModified && (displayMessage === 1) ?
                        <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao modificar o utilizador. Por favor, verifique os seus dados.</Typography>
                        </Alert> : <></>
                    }
                </Box>
            </Grid>
        </>
    )
}