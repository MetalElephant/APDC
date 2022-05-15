import react from "react"
import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import logoWelcome from "../images/logo-welcome.png";
import { Box, Grid, Tabs, Tab } from "@mui/material";
import ParcelsPage from "./ParcelsPage";
import DrawerMessingAround from "./DrawerMessingAround";
import UserProfile from "../userProfileComponents/UserProfile";


export default function NavbarOps() {

    const [selectedTab, setSelectedTab] = react.useState(0);

    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };


    return (
        <>
            <Grid container direction="row" bgcolor="#D3D3D3" height="165px"  >
                <Grid item xs={4}  >
                    <Box component="img" src={logoProduto} width="300px" sx={{ mt: "5px" }} />
                </Grid>
                <Grid item xs={4} align="center">
                    <Box component="img" src={logoWelcome} width="300px" sx={{ ml: "20px" }} />
                </Grid>
                <Grid item xs={2}>
                    <Tabs textColor='inherit'
                        TabIndicatorProps={{ style: { background: "black" } }}
                        value={selectedTab} onChange={handleChange}
                        sx={{ bgcolor: "whitesmoke", mt: "37%", width: "90%" }}
                        centered
                    >
                        <Tab sx={{ color: "darkgreen" }} label="User" />
                        <Tab sx={{ color: "darkgreen" }} label="Parcels" />
                        <Tab sx={{ color: "darkgreen" }} label="Rewards" />
                    </Tabs>
                </Grid>
                <Grid item xs={2}>
                    <Box component="img" src={logoEquipa} width="310px" sx={{ ml: "auto", mb: "20px", display: "flex" }} />
                </Grid>
            </Grid>
           {/* {selectedTab === 0 && <Main />} */}
            {selectedTab === 0 && <UserProfile />}
            {selectedTab === 1 && <ParcelsPage />}

        </>
    )
}