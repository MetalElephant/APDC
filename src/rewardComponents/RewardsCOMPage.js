import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import RedeemIcon from '@mui/icons-material/Redeem';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';
import COMAddReward from "./COMAddReward";
import {useHistory} from "react-router-dom";
import restCalls from "../restCalls"
import LogoutIcon from '@mui/icons-material/Logout';
import COMRemoveReward from "./COMManageRewards";
import COMManageRewards from "./COMManageRewards";


export default function RewardsMerchantPage() {
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
                        id="3"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<RedeemIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(0) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Gerir Recompensas </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<RedeemIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Adicionar Recompensa </Typography>
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
                {(display === 0) ? <COMManageRewards />: <></>}
                {(display === 1) ? <COMAddReward /> : <></>}
            </Grid>
        </Grid>
    )
}