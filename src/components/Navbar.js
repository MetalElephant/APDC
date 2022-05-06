import React from "react"
import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import { Typography, Grid} from "@mui/material";
import { Box } from "@mui/system";

export default function Navbar() {
    return(
        <nav>
            <Grid container direction="row" justifycontext="space-between" alignItems="center" bgcolor="#D3D3D3" height="170px" >
                    <Grid item xs ={3}>
                       <Box component="img" src = {logoProduto} width="170px" sx={{ml: "20px"}}  />
                    </Grid>
                    <Grid item xs ={6}> 
                        <Typography variant="h3" align = "center"> Welcome!</Typography>
                    </Grid>
                    <Grid item xs ={3}>
                        <Box component="img" src = {logoEquipa} width="220px" sx={{ml: "auto", mr: "20px", display: "flex"}} />
                    </Grid>
            </Grid>
        </nav>
    )
}