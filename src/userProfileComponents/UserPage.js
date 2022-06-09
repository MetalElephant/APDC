import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import UserInfo from "./UserInfo"
import ModifyPassword from "./ModifyPassword";
import restCalls from "../restCalls"
import {useHistory} from "react-router-dom";
import ModifyAttributes from "./ModifyAttributes";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Main() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);

    function logoutManager() {
        restCalls.logout().then(() => { history.push("/") })
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
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> user info </Typography>
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
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modify password </Typography>
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
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modify attributes </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<LogoutIcon sx={{color:"black"}}/>}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { logoutManager()}}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> logout </Typography>
                    </Button>
                </Grid>
                {(display === 0) ? <UserInfo /> : <></>}
                {(display === 1) ? <ModifyPassword /> : <></>}
                {(display === 2) ? <ModifyAttributes /> : <></>}
            </Grid>
        </Grid>
    )
}