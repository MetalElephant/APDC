import react, { useEffect } from "react"
import { Button, Grid, Typography, CircularProgress } from "@mui/material";
import UserInfo from "./UserInfo"
import ModifyPassword from "./ModifyPassword";
import restCalls from "../restCalls"
import { useHistory } from "react-router-dom";
import ModifyAttributes from "./ModifyAttributes";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Main(props) {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);
    const [showProgress, setShowProgress] = react.useState(false);
    const [onlyPassword, setOnlyPassword] = react.useState(false);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user')).points < 0) {
            setDisplay(1)
            setOnlyPassword(true)
        }
    }, [])

    function logoutManager() {
        setShowProgress(true)
        restCalls.logout().then(() => { history.push("/"); setShowProgress(false) })
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    {!onlyPassword &&
                        <div>
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
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Informação de Utilizador </Typography>
                            </Button>

                            <Button
                                type="submit"
                                id="2"
                                fullWidth
                                variant="outlined"
                                color="success"
                                startIcon={<LockResetIcon sx={{ color: "black" }} />}
                                sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={() => { setDisplay(1) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar Palavra-passe </Typography>
                            </Button>
                            <Button
                                type="submit"
                                id="3"
                                fullWidth
                                variant="outlined"
                                color="success"
                                startIcon={<ChangeCircleIcon sx={{ color: "black" }} />}
                                sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={() => { setDisplay(2) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar Atributos </Typography>
                            </Button>
                        </div>
                    }
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
                {(display === 0) && <UserInfo />}
                {(display === 1) && <ModifyPassword onClickFun={props.onClickFun1()} />}
                {(display === 2) && <ModifyAttributes />}
            </Grid>
        </Grid>
    )
}