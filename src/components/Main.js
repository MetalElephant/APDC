import react from "react"
import { Box, Container, Typography, TextField, Button, Grid } from "@mui/material";
import RegisterParcel from "./RegisterParcel";
import { Component } from "react";

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
                {(display == 0) ? <Typography> O RAFA É BOSS </Typography>: <></>}
                {(display == 1) ? <RegisterParcel /> : <></>}
                {(display == 2) ? <Typography> GUILHERME E KIARA, DEUSES DO ANDROID </Typography>: <></>}
                {(display == 3) ? <Typography> O ALEX É BOSS </Typography>: <></>}
                
            </Grid>
        </Grid>
    )
}
