import react from "react"
import {Button, Grid, Typography } from "@mui/material";
import RegisterParcel from "./RegisterParcel";
import ModifyParcel from "./ModifyParcel";
import Logout from "./Logout";
import UserInfo from "./UserInfo"
import ParcelInfo from "./ParcelInfo";

export default function Main() {

    const [display, setDisplay] = react.useState(0);

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container>
                <Grid item xs={2}>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(0) }}
                    >
                        User Info
                    </Button>
                    <Button
                        type="submit"
                        id="2"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        Parcel Info
                    </Button>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(2) }}
                    >
                        Register Parcel
                    </Button>
                    <Button
                        type="submit"
                        id="4"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(3) }}
                    >
                        Modify Parcel
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(4) }}
                    >
                        Logout
                    </Button>
                </Grid>
                {(display === 0) ? <UserInfo />: <></>}
                {(display === 1) ? <ParcelInfo />: <></>}
                {(display === 2) ? <RegisterParcel /> : <></>}
                {(display === 3) ? <ModifyParcel />: <></>}
                {(display === 4) ? <Logout />: <></>}
                
            </Grid>
        </Grid>
    )
}
