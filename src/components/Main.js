import react from "react"
import {Typography, Button, Grid } from "@mui/material";
import RegisterParcel from "./RegisterParcel";
import ModifyParcel from "./ModifyParcel";
import { UserInfo } from "./UserInfo";
import Logout from "./Logout";

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
                        Register Parcel
                    </Button>
                    <Button
                        type="submit"
                        id="3"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(2) }}
                    >
                        Modify Parcel
                    </Button>
                    <Button
                        type="submit"
                        id="4"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 1, mb: 1, height: "40px" }}
                        onClick={() => { setDisplay(3) }}
                    >
                        Logout
                    </Button>
                </Grid>
                {(display === 0) ? <UserInfo />: <></>}
                {(display === 1) ? <RegisterParcel /> : <></>}
                {(display === 2) ? <ModifyParcel />: <></>}
                {(display === 3) ? <Logout />: <></>}
                
            </Grid>
        </Grid>
    )
}
