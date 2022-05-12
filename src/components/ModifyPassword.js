import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


export default function ModifyPassword() {

    const [oldPassword, setOldPassword] = react.useState("");
    const [newPassword, setNewPassword] = react.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = react.useState("");

    const [displayMessage, setDisplayMessage] = react.useState(false);
    const [isModifyPwdSubmit, setIsModifyPwdSubmit] = react.useState(true);

    const [showOldPassword, setShowOldPassword] = react.useState(false);
    const [showNewPassword, setShowNewPassword] = react.useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = react.useState(false);

    function oldPasswordHandler(e) {
        setOldPassword(e.target.value);
    }

    function newPasswordHandler(e) {
        setNewPassword(e.target.value);
    }

    function confirmNewPasswordHandler(e) {
        setConfirmNewPassword(e.target.value);
    }

    function modifyPasswordManager(e) {
        e.preventDefault();
        restCalls.modifyPassword(oldPassword, newPassword, confirmNewPassword).then(() => { setIsModifyPwdSubmit(true) }).catch(() => { setIsModifyPwdSubmit(false) });
        setDisplayMessage(true)
    }

    const toggleVisibilityFirstIcon = () => {
        setShowOldPassword(!showOldPassword)
    }

    const toggleVisibilitySecondIcon = () => {
        setShowNewPassword(!showNewPassword)
    }

    const toggleVisibilityThirdIcon = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword)
    }

    return (
        <>
            <Grid item xs={5}>
                <Container component="main" maxWidth="xs">
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
                            Password Modification
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="oldPassword"
                                label="Old Password"
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                color="success"
                                InputProps={showOldPassword ? {
                                    endAdornment: <Button onClick={toggleVisibilityFirstIcon}>
                                        <VisibilityOffIcon sx={{color: "black"}}/>
                                    </Button>
                                } : {
                                    endAdornment: <Button onClick={toggleVisibilityFirstIcon}>
                                        <RemoveRedEyeIcon sx={{color: "black"}}/>
                                    </Button>
                                }}
                                onChange={oldPasswordHandler}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="newPassword"
                                label="New Password"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                color="success"
                                InputProps={showNewPassword ? {
                                    endAdornment: <Button onClick={toggleVisibilitySecondIcon}>
                                        <VisibilityOffIcon sx={{color: "black"}}/>
                                    </Button>
                                } : {
                                    endAdornment: <Button onClick={toggleVisibilitySecondIcon}>
                                        <RemoveRedEyeIcon sx={{color: "black"}}/>
                                    </Button>
                                }}
                                onChange={newPasswordHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                id="confirmNewPassword"
                                type={showConfirmNewPassword ? "text" : "password"}
                                color="success"
                                InputProps={showConfirmNewPassword ? {
                                    endAdornment: <Button onClick={toggleVisibilityThirdIcon}>
                                        <VisibilityOffIcon sx={{color: "black"}}/>
                                    </Button>
                                } : {
                                    endAdornment: <Button onClick={toggleVisibilityThirdIcon}>
                                        <RemoveRedEyeIcon sx={{color: "black"}}/>
                                    </Button>
                                }}
                                onChange={confirmNewPasswordHandler}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { modifyPasswordManager(e) }}
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
                sx={{ mt: "52px" }}
            >
                {isModifyPwdSubmit && displayMessage ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Password modificada com sucesso.</Typography>
                    </Alert> : <></>}
                {!isModifyPwdSubmit && displayMessage ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao modificar a password. Por favor, verifique os seus dados.</Typography>
                    </Alert> : <></>}
            </Grid>
        </>
    )
}