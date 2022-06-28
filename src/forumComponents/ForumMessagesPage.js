import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import MessageIcon from '@mui/icons-material/Message';
import MessagesList from "./MessagesList";
import {useHistory} from "react-router-dom";
import restCalls from "../restCalls"
import LogoutIcon from '@mui/icons-material/Logout';

export default function ForumMessagesPage() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);

    function logoutManager() {
        restCalls.logout().then(() => { history.push("/") })
    }

    return (
        <Grid item xs={12} container align="center">
            <Grid item xs={2}>
                <Button
                    disabled
                    type="submit"
                    id="3"
                    fullWidth
                    variant="outlined"
                    color="success"
                    startIcon={<ListAltIcon sx={{ color: "black" }} />}
                    sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => { setDisplay(0) }}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Lista de Mensagens </Typography>
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
            {(display === 0) ? <MessagesList /> : <></>}
        </Grid>

    )
}