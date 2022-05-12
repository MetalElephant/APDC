import react from "react"
import {Button, Grid, Typography} from "@mui/material";
import RegisterParcel from "./RegisterParcel";
import ModifyParcel from "./ModifyParcel";
import restCalls from "../restCalls"
//import UserInfo from "./UserInfo"
import ParcelInfo from "./ParcelInfo";
import UserProfile from "./UserProfile";
import {useHistory} from "react-router-dom";

export default function Main() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(2);

    function logoutManager(e) {
        e.preventDefault()
        restCalls.logout().then(() => {history.push("/")})
    }

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container>
                <Grid item xs={2} textAlign="center">
                    <Button
                        type="submit"
                        id="2"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2, width: "240px", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> parcel info </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2, width: "240px", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(2) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> register parcel </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="4"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2, width: "240px", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(3) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modify parcel </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2, width: "240px", height: "40px", bgcolor: "rgb(50,190,50)"}}
                        onClick={() => { setDisplay(4) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> profile </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="outlined"
                        color="success"
                        sx={{ mt: 2, width: "240px", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={(e) => { logoutManager(e) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> logout </Typography>
                    </Button>
                </Grid>
                {(display === 1) ? <ParcelInfo />: <></>}
                {(display === 2) ? <RegisterParcel /> : <></>}
                {(display === 3) ? <ModifyParcel />: <></>}
                {(display === 4) ? <UserProfile />: <></>}
            </Grid>
        </Grid>
    )
}
