import react from "react"
import { Button, Grid, Typography, CircularProgress } from "@mui/material";
import RegisterParcel from "./RegisterParcel";
import ModifyParcel from "./ModifyParcel";
import SearchParcel from "./SearchParcel";
import restCalls from "../restCalls"
import ParcelInfo from "./ParcelInfo";
import { useHistory } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FeedIcon from '@mui/icons-material/Feed';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';

export default function Main() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);
    const [showProgress, setShowProgress] = react.useState(false);

    function logoutManager() {
        setShowProgress(true)
        restCalls.logout()
            .then(() => { history.push("/"); setShowProgress(false) })
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
                        startIcon={<AddCircleIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(0) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Registar parcela </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="2"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<FeedIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Informação de Parcelas </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="4"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<ChangeCircleIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(2) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar parcelas </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="4"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<SearchIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(3) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Consultar Parcelas </Typography>
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
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "8%", left: "50%", overflow: "auto" }} />}
                {(display === 0) ? <RegisterParcel /> : <></>}
                {(display === 1) ? <ParcelInfo /> : <></>}
                {(display === 2) ? <ModifyParcel /> : <></>}
                {(display === 3) ? <SearchParcel /> : <></>}

            </Grid>
        </Grid>
    )
}