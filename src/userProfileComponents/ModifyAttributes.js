import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel } from "@mui/material";

export default function ModifyAttributes() {

    const [name, setName] = react.useState("");
    const [email, setEmail] = react.useState("");
    const [visibility, setVisibility] = react.useState();
    const [homePhone, setHomePhone] = react.useState("");
    const [mobilePhone, setMobilePhone] = react.useState("");
    const [address, setAddress] = react.useState("");
    const [nif, setNif] = react.useState("");

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
        e.preventDefault()
        restCalls.modifyUserAttributes(name, email, visibility, address, homePhone, mobilePhone, nif).then(() => { restCalls.userInfo()})
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
                        <Box component="form" sx={{mt: 1 }}>
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
                                onChange = {homePhoneHandler} 
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="mobilePhone"
                                label="Mobile Phone"
                                id="mobilePhone"
                                color="success"
                                onChange = {mobilePhoneHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="address"
                                label="Address"
                                id="address"
                                color="success"
                                onChange = {addressHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="nif"
                                label="NIF"
                                id="nif"
                                color="success"
                                onChange = {nifHandler}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { modifyAttributesManager(e)}}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </>
    )
}