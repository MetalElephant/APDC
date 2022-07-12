import react from "react"
import { Button, Grid, Typography, CircularProgress } from "@mui/material";
import restCalls from "../restCalls"
import { useHistory } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddUser from "../userProfileComponents/AddUser"
import ListUsers from "../userProfileComponents/ListUsers"

export default function SUUsers() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);
    const [showProgress, setShowProgress] = react.useState(false);

    function logoutManager() {
        setShowProgress(true)
        restCalls.logout().then(() => { history.push("/"); setShowProgress(false) })
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<AccountBoxIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(0) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Gerir Utilizadores </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<PersonAddIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Adicionar Utilizador </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<LogoutIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { logoutManager() }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> logout </Typography>
                    </Button>
                </Grid>
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }} />}
                {(display === 0) ? <ListUsers /> : <></>}
                {(display === 1) ? <AddUser /> : <></>}
            </Grid>
        </Grid>
    )
}