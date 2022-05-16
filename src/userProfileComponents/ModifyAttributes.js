import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel, Alert } from "@mui/material";

export default function ModifyAttributes() {

    const [name, setName] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [visibility, setVisibility] = react.useState("");
    const [homePhone, setHomePhone] = react.useState("");
    const [mobilePhone, setMobilePhone] = react.useState("");
    const [address, setAddress] = react.useState("");
    const [nif, setNif] = react.useState("");

    const [noModificationsErr, setNoModificationsErr] = react.useState({});
    const [emailErr, setEmailErr] = react.useState({});
    const [homePhoneErr, setHomePhoneErr] = react.useState({});
    const [mobilePhoneErr, setMobilePhoneErr] = react.useState({});
    const [nifErr, setNifErr] = react.useState({});
    

    const [displayMessage, setDisplayMessage] = react.useState(0);
    const [userModified, setUserModified] = react.useState(false);
    const [userNotModified, setUserNotModified] = react.useState(false);

    function nameHandler(e) {
        setName(e.target.value);
    }

    function emailHandler(e) {
        setEmail(e.target.value);
    }

    function visibilityHandler(e) {
        setVisibility(e.target.value);
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

    function modifyAttributesManager(e) {
        e.preventDefault();
        const isModifyUserFormValid = modifyUserFormValidation();

        if (isModifyUserFormValid) {
            restCalls.modifyUserAttributes(name, email, visibility, address, homePhone, mobilePhone, nif).then(() => { restCalls.userInfo().then(() => { setUserModified(true); setDisplayMessage(0) }) })
        } else {
            setUserNotModified(true);
            setDisplayMessage(1);
        }
    }

    const modifyUserFormValidation = () => {
        const noModificationsErr = {};
        const emailErr = {};
        const homePhoneErr = {};
        const mobilePhoneErr = {};
        const nifErr = {};
        let isValid = true;

        if (name.length === 0 && email.length === 0 && visibility.length === 0 && homePhone.length === 0 && mobilePhone.length === 0 && address.length === 0 && nif.length === 0) {
            noModificationsErr.noModifications = "No modifications were made to the user."
            isValid = false;
            setNoModificationsErr(noModificationsErr)
        }

        if ((email.length > 0) && (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null)) {
            emailErr.emailWithoutValidFormat = "Email must be of a valid format.";
            isValid = false;
            setEmailErr(emailErr)
        }

        if((homePhone.length > 0) && (homePhone.length !== 9) && (homePhone.match(/[a-zA-Z]/) != null))  {
            homePhoneErr.not9Digits = "Home phone is not composed of nine digits."
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if((homePhone.match(/[a-zA-Z]/) != null) || (homePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null))  {
            homePhoneErr.onlyNumbers = "Home phone must not contain any letters or special characters."
            isValid = false;
            setHomePhoneErr(homePhoneErr)
        }

        if((mobilePhone.length > 0) && (mobilePhone.length !== 9)) {
            mobilePhoneErr.not9Digits = "Mobile phone is not composed of nine digits."
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if((mobilePhone.match(/[a-zA-Z]/) != null) || (mobilePhone.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null))  {
            mobilePhoneErr.onlyNumbers = "Mobile phone must not contain any letters or special characters."
            isValid = false;
            setMobilePhoneErr(mobilePhoneErr)
        }

        if((nif.length > 0) && (nif.length !== 9)) {
            nifErr.not9Digits = "NIF is not composed of nine digits."
            isValid = false;
            setNifErr(nifErr)
        }

        if((nif.match(/[a-zA-Z]/) != null) || (nif.match(/[$&+,:;=?@#|'<>.*()%!-]/) != null))  {
            nifErr.onlyNumbers = "NIF must not contain any letters or special characters."
            isValid = false;
            setNifErr(nifErr)
        }

        setNoModificationsErr(noModificationsErr)
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
                            User Attributes Modification
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                autoFocus
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
                                label="Name"
                                name="nome"
                                color="success"
                                onChange={nameHandler}
                            />
                            <FormControl align="left" sx={{ mt: "13px" }}>
                                <FormLabel id="demo-radio-buttons-group-label" ><Typography color="green">Profile Visibility</Typography></FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                    row
                                    onChange={visibilityHandler}
                                >
                                    <FormControlLabel value="Public" control={<Radio color="success" />} label="Public" sx={{ color: "black" }} />
                                    <FormControlLabel value="Private" control={<Radio color="success" />} label="Private" sx={{ color: "black" }} />
                                </RadioGroup>
                            </FormControl>

                            <TextField
                                margin="normal"
                                fullWidth
                                name="homePhone"
                                label="Home Phone"
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
                                label="Mobile Phone"
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
                                name="address"
                                label="Address"
                                id="address"
                                color="success"
                                onChange={addressHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="nif"
                                label="NIF"
                                id="nif"
                                color="success"
                                onChange={nifHandler}
                            />
                            {Object.keys(nifErr).map((key) => {
                                return <Typography sx={{ color: "red", fontSize: 14 }}> {nifErr[key]}</Typography>
                            })}

                            {Object.keys(noModificationsErr).map((key) => {
                                return <Typography sx={{ color: "red", fontSize: 14 }}> {noModificationsErr[key]}</Typography>
                            })}
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { modifyAttributesManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
                            </Button>
                        </Box>
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
            </Grid>
        </>
    )
}