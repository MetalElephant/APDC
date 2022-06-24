import react from "react"
import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import logoWelcome from "../images/logo-welcome.png";
import { Box, Grid, Tabs, Tab } from "@mui/material";
import ParcelsPage from "../parcelComponents/ParcelsPage";
import UserPage from "../userProfileComponents/UserPage";
import AboutUs from "./AboutUs"
import RewardsPage from "../rewardComponents/RewardsPage"
import ForumPage from "../forumComponents/ForumPage"
import StatisticsPage from "../statisticsComponents/StatisticsPage";



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
                {/*
                <Grid item xs={2.5} container direction="row" alignItems="flex-end" justify="center">
                    <Tabs textColor='inherit'
                        TabIndicatorProps={{ sx: { background: "black" } }}
                        value={selectedLeftTab}
                        onChange={handleChangeLeft}
                        variant="scrollable"
                        scrollButtons
                    >
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="User" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Parcels" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Rewards" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Forum" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="About Us" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Statistics" />

                    </Tabs>
                </Grid>
                <Grid item xs={3} align="center">
                    <Box component="img" src={logoWelcome} width="300px" sx={{ ml: "20px" }} />
                </Grid>
                <Grid item xs={2.5}>
                </Grid>
                */}

                <Grid item xs={8} container direction="row" alignItems="flex-end" justify="center">
                    <Tabs textColor='inherit'
                        TabIndicatorProps={{ sx: { background: "black" } }}
                        value={selectedLeftTab}
                        onChange={handleChangeLeft}
                        variant="scrollable"
                        scrollButtons
                    >
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="User" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Parcels" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Rewards" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Forum" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="About Us" />
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Statistics" />

                    </Tabs>
                </Grid>
                <Grid item xs={2}>
                    <Box component="img" src={logoEquipa} width="310px" sx={{ ml: "auto", display: "flex" }} />
                </Grid>
            </Grid>
            {selectedLeftTab === 0 && <UserPage />}
            {selectedLeftTab === 1 && <ParcelsPage />}
            {selectedLeftTab === 2 && <RewardsPage />}
            {selectedLeftTab === 3 && <ForumPage />}
            {selectedLeftTab === 4 && <AboutUs />}
            {selectedLeftTab === 5 && <StatisticsPage />}

        </>
    )
}