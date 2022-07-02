import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import logoWelcome from "../images/logo-welcome.png";
import { Box, Grid } from "@mui/material";
import { useHistory } from "react-router-dom"


export default function NavbarLR() {

    let history = useHistory();

    function goBack() {
        var roleType = JSON.parse(localStorage.getItem('user')).role
        switch (roleType) {
            case "PROPRIETARIO":
                history.push("/proprietario")
                break;
            case "COMERCIANTE":
                history.push("/comerciante")
                break;
            case "REPRESENTANTE":
                history.push("/representante")
                break;
            case "MODERADOR":
                history.push("/moderador")
                break;
            case "SUPERUSER":
                history.push("/superuser")
                break;
            default:
                break;
        }
    }

    return (
        <Grid container direction="row" bgcolor="#D3D3D3" height="165px"  >
            <Grid item xs={4}  >
                <Box onClick={() => { goBack() }} component="img" src={logoProduto} width="300px" sx={{ mt: "5px", cursor: "pointer" }} />
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