import react from "react"
import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import logoWelcome from "../images/logo-welcome.png";
import { Box, Grid, Tabs, Tab } from "@mui/material";


export default function NavbarLR() {

    return (
        <Grid container direction="row" bgcolor="#D3D3D3" height="165px"  >
            <Grid item xs={4}  >
                <Box component="img" src={logoProduto} width="300px" sx={{ mt: "5px" }} />
            </Grid>
            <Grid item xs={4} align="center">
                <Box component="img" src={logoWelcome} width="300px" sx={{ ml: "20px" }} />
            </Grid>
            <Grid item xs={4}>
                <Box component="img" src={logoEquipa} width="310px" sx={{ ml: "auto", mb: "20px", display: "flex" }} />
            </Grid>
        </Grid>
    )
}