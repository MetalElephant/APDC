import react from "react"
import restCalls from "../restCalls"
import {useHistory} from "react-router-dom";
import { Button, Grid, Typography, CircularProgress } from "@mui/material";
import RedeemIcon from '@mui/icons-material/Redeem';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
import OWNERRedeemableRewards from "./OWNERRedeemableRewards";
import LogoutIcon from '@mui/icons-material/Logout';
import OWNERRedeemedRewards from "./OWNERRedeemedRewards";

export default function RewardsOWNERPage() {
    let history = useHistory();
    const [display, setDisplay] = react.useState(0);
    const [showProgress, setShowProgress] = react.useState(false);

    function logoutManager() {
        setShowProgress(true)
        restCalls.logout().then(() => {history.push("/"); setShowProgress(true)})
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<RedeemIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(0) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Recompensas por reinvidicar </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<RedeemTwoToneIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Recompensas reinvidicadas </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<LogoutIcon sx={{color:"black"}}/>}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { logoutManager() }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> logout </Typography>
                    </Button>
                </Grid>
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }}/>}
                {(display === 0) && <OWNERRedeemableRewards />}
                {(display === 1) && <OWNERRedeemedRewards />}
            </Grid>
        </Grid>
    )
}