import react from "react"
import {Button, Grid} from "@mui/material";
import RegisterParcel from "./RegisterParcel";
import ModifyParcel from "./ModifyParcel";
import restCalls from "../restCalls"
import UserInfo from "./UserInfo"
import ParcelInfo from "./ParcelInfo";
import {useHistory} from "react-router-dom";

export default function Main() {
    let history = useHistory();

    const [display, setDisplay] = react.useState(0);

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
                        id="1"
                        variant="contained"
                        sx={{ mt: 2, width: "240px", height: "40px"}}
                        onClick={() => { setDisplay(0) }}
                    >
                        User Info
                    </Button>
                    <Button
                        type="submit"
                        id="2"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, width: "240px", height: "40px" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        Parcel Info
                    </Button>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, width: "240px", height: "40px" }}
                        onClick={() => { setDisplay(2) }}
                    >
                        Register Parcel
                    </Button>
                    <Button
                        type="submit"
                        id="4"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, width: "240px", height: "40px" }}
                        onClick={() => { setDisplay(3) }}
                    >
                        Modify Parcel
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2, width: "240px", height: "40px" }}
                        onClick={(e) => { logoutManager(e) }}
                    >
                        Logout
                    </Button>
                </Grid>
                {(display === 0) ? <UserInfo />: <></>}
                {(display === 1) ? <ParcelInfo />: <></>}
                {(display === 2) ? <RegisterParcel /> : <></>}
                {(display === 3) ? <ModifyParcel />: <></>}
                
            </Grid>
        </Grid>
    )
}
