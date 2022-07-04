import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import restCalls from "../restCalls"
import { useHistory } from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import FeedIcon from '@mui/icons-material/Feed';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import RemoveIcon from '@mui/icons-material/Remove';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageRewards from "../rewardComponents/ManageRewards"

export default function SURewards() {
    let history = useHistory();

    function logoutManager() {
        restCalls.logout().then(() => { history.push("/") })
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    <Button
                        disabled
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<FeedIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Gerir Recompensas </Typography>
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
                <ManageRewards />
            </Grid>
        </Grid>
    )
}
