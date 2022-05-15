import react from "react"
import {Button, Grid, Typography} from "@mui/material";
import UserInfo from "./UserInfo"
import ModifyPassword from "./ModifyPassword";
import DrawerMessingAround from "../mainFixedComponents/DrawerMessingAround"
import ModifyAttributes from "./ModifyAttributes";

export default function Main() {

    const [display, setDisplay] = react.useState(0);

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                <Button
                    type="submit"
                    id="1"
                    fullWidth
                    variant="outlined"
                    color="success"
                    sx={{ mt: 2, width: "75%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => {setDisplay(0)}}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> user info </Typography>
                </Button>
                <Button
                    type="submit"
                    id="2"
                    fullWidth
                    variant="outlined"
                    color="success"
                    sx={{ mt: 2, width: "75%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => {setDisplay(1)}}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modify password </Typography>
                </Button>
                <Button
                    type="submit"
                    id="3"
                    fullWidth
                    variant="outlined"
                    color="success"
                    sx={{ mt: 2, width: "75%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={() => {setDisplay(2)}}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modify attributes </Typography>
                </Button>
            </Grid>
            {(display === 0) ? <UserInfo />: <></>}
            {(display === 1) ? <ModifyPassword />: <></>}
            {(display === 2) ? <ModifyAttributes />: <></>}
            </Grid>
        </Grid>
    )
}