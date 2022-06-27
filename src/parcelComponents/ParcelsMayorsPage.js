import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import restCalls from "../restCalls"
import ReviewParcels from "./ReviewParcels";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import FeedIcon from '@mui/icons-material/Feed';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Main() {

    let history = useHistory();


    useEffect(() => {
        var user = JSON.parse(localStorage.getItem('user'))
        restCalls.getParcelsByRegion("freg", 3)
    }, [])

    function logoutManager() {
        restCalls.logout().then(() => { history.push("/") })
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    {/*
                    <Button
                        type="submit"
                        id="2"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<FeedIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Verificação de parcelas </Typography>
                    </Button>
                    */}
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
                <ReviewParcels />
            </Grid>
        </Grid>
    )
}