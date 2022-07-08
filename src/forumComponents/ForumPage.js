import react from "react"
import { Button, Grid, Typography, CircularProgress } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CreateForum from "./CreateForum";
import UserForums from "./UserForums";
import ForumsList from "./ForumsList";
import { useHistory } from "react-router-dom";
import restCalls from "../restCalls"
import LogoutIcon from '@mui/icons-material/Logout';

export default function ForumPage() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);
    const [showProgress, setShowProgress] = react.useState(false);

    function logoutManager() {
        setShowProgress(true)
        restCalls.logout().then(() => { history.push("/"); setShowProgress(false) })
    }

    return (
        <Grid item xs={12} container align="center">
            <Grid item xs={2}>
                <Button
                    type="submit"
                    id="3"
                    fullWidth
                    variant="outlined"
                    color="success"
                    startIcon={<ListAltIcon sx={{ color: "black" }} />}
                    sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => { setDisplay(0) }}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Lista de Fóruns </Typography>
                </Button>
                <Button
                    type="submit"
                    id="3"
                    fullWidth
                    variant="outlined"
                    color="success"
                    startIcon={<ListAltIcon sx={{ color: "black" }} />}
                    sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => { setDisplay(1) }}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Fóruns criados por si </Typography>
                </Button>
                <Button
                    type="submit"
                    id="3"
                    fullWidth
                    variant="outlined"
                    color="success"
                    startIcon={<ForumIcon sx={{ color: "black" }} />}
                    sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => { setDisplay(2) }}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Criar Fórum </Typography>
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
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }}/>}
                {(display === 0) ? <ForumsList /> : <></>}
                {(display === 1) ? <UserForums /> : <></>}
                {(display === 2) ? <CreateForum /> : <></>}
        </Grid>

    )
}