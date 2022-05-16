import react from "react"
import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import logoWelcome from "../images/logo-welcome.png";
import { Box, Grid, Tabs, Tab, Typography } from "@mui/material";
import ParcelsPage from "./ParcelsPage";
import DrawerMessingAround from "./DrawerMessingAround";
import UserPage from "../userProfileComponents/UserPage";
import Logout from "../userComponents/Logout";


export default function NavbarOps() {

    const [selectedLeftTab, setSelectedLeftTab] = react.useState(0);

    const handleChangeLeft = (event, newValue) => {
        setSelectedLeftTab(newValue);
    };

    return (
        <>
            <Grid container direction="row" bgcolor="#D3D3D3" height="165px"  >
                <Grid item xs={2}  >
                    <Box component="img" src={logoProduto} width="300px" sx={{ mt: "5px" }} />
                </Grid>
                <Grid item xs={2}>
                <Tabs textColor='inherit'
                        TabIndicatorProps={{ style: { background: "black" } }}
                        value={selectedLeftTab} onChange={handleChangeLeft}
                        sx={{ bgcolor: "whitesmoke", mt: "37%", width: "100%" }}
                        centered
                    >
                        <Tab sx={{ color: "darkgreen" }} label="User" />
                        <Tab sx={{ color: "darkgreen" }} label="Parcels" />
                        <Tab sx={{ color: "darkgreen" }} label="Rewards" />
                    </Tabs>
                </Grid>
                <Grid item xs={4} align="center">
                    <Box component="img" src={logoWelcome} width="300px" sx={{ ml: "20px" }} />
                </Grid>
                <Grid item xs={2}>
                </Grid>
                <Grid item xs={2}>
                    <Box component="img" src={logoEquipa} width="310px" sx={{ ml: "auto", mb: "20px", display: "flex" }} />
                </Grid>
            </Grid>
            {selectedLeftTab === 0 && <UserPage />}
            {selectedLeftTab === 1 && <ParcelsPage />}
            {selectedLeftTab === 2 && <>OLA</>} 
        </>
    )
}