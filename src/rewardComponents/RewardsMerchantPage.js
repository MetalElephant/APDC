import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import RewardsList from "./RewardsList"
import RedeemIcon from '@mui/icons-material/Redeem';
import RedeemTwoToneIcon from '@mui/icons-material/RedeemTwoTone';

export default function RewardsMerchantPage() {

    const [display, setDisplay] = react.useState(0);

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
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> create reward </Typography>
                    </Button>
                </Grid>
                {(display === 0) ? <></> : <></>}
                {(display === 1) ? <></>: <></>}
            </Grid>
        </Grid>
    )
}