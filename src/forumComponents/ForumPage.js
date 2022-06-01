import react from "react"
import { Button, Grid, Typography } from "@mui/material";
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

    function logoutManager() {
        restCalls.logout().then(() => { history.push("/") })
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
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> forums list </Typography>
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
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> user forums </Typography>
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
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> create forum </Typography>
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
            {(display === 0) ? <ForumsList /> : <></>}
            {(display === 1) ? <UserForums /> : <></>}
            {(display === 2) ? <CreateForum /> : <></>}
        </Grid>

    )
}