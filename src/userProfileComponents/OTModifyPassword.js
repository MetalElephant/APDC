import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert, CircularProgress } from "@mui/material";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function ModifyPassword(props) {

    const [oldPassword, setOldPassword] = react.useState("");
    const [newPassword, setNewPassword] = react.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = react.useState("");

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isModifyPwdSubmit, setIsModifyPwdSubmit] = react.useState(false);
    const [isModifyPwdNotSubmit, setIsModifyPwdNotSubmit] = react.useState(false);

    const [showOldPassword, setShowOldPassword] = react.useState(false);
    const [showNewPassword, setShowNewPassword] = react.useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false);

    function oldPasswordHandler(e) {
        setOldPassword(e.target.value);
    }

    function newPasswordHandler(e) {
        setNewPassword(e.target.value);
    }

    function confirmNewPasswordHandler(e) {
        setConfirmNewPassword(e.target.value);
    }

    function resetPasswords() {
        setConfirmNewPassword("");
        setNewPassword("");
        setOldPassword("");
    }

    function modifyPasswordManager(e) {
        e.preventDefault();
        setShowProgress(true)
        restCalls.modifyPassword(oldPassword, newPassword, confirmNewPassword)
            .then(() => { setIsModifyPwdSubmit(true); setDisplayMessage(0); resetPasswords(); setShowProgress(false); props.onClickFun() })
            .catch(() => { setIsModifyPwdNotSubmit(true); setDisplayMessage(1); setShowProgress(false) });
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
                            Modifique a Palavra-passe
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="oldPassword"
                                label="Palavra-passe Antiga"
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                value={oldPassword}
                                color="success"
                                InputProps={showOldPassword ? {
                                    endAdornment: <Button onClick={toggleVisibilityFirstIcon}>
                                        <RemoveRedEyeIcon sx={{ color: "black" }} />
                                    </Button>
                                } : {
                                    endAdornment: <Button onClick={toggleVisibilityFirstIcon}>
                                        <VisibilityOffIcon sx={{ color: "black" }} />
                                    </Button>
                                }}
                                onChange={oldPasswordHandler}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="newPassword"
                                label="Palavra-passe Nova"
                                name="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                color="success"
                                InputProps={showNewPassword ? {
                                    endAdornment: <Button onClick={toggleVisibilitySecondIcon}>
                                        <RemoveRedEyeIcon sx={{ color: "black" }} />
                                    </Button>
                                } : {
                                    endAdornment: <Button onClick={toggleVisibilitySecondIcon}>
                                        <VisibilityOffIcon sx={{ color: "black" }} />
                                    </Button>
                                }}
                                onChange={newPasswordHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmNewPassword"
                                label="Confirmação da Palavra-passe Nova"
                                id="confirmNewPassword"
                                type={showConfirmNewPassword ? "text" : "password"}
                                value={confirmNewPassword}
                                color="success"
                                InputProps={showConfirmNewPassword ? {
                                    endAdornment: <Button onClick={toggleVisibilityThirdIcon}>
                                        <RemoveRedEyeIcon sx={{ color: "black" }} />
                                    </Button>
                                } : {
                                    endAdornment: <Button onClick={toggleVisibilityThirdIcon}>
                                        <VisibilityOffIcon sx={{ color: "black" }} />
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
                alignItems="center"
                sx={{ mt: "52px" }}
            >
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "35%", left: "50%", overflow: "auto" }} />}

                {isModifyPwdSubmit && (displayMessage === 0) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Password modificada com sucesso.</Typography>
                    </Alert> : <></>}
                {isModifyPwdNotSubmit && (displayMessage === 1) ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao modificar a password. Por favor, verifique os seus dados.</Typography>
                    </Alert> : <></>}
            </Grid>
        </>
    )
}