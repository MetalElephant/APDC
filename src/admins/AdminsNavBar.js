import react, { useEffect } from "react"
import logoProduto from "../images/logo-produto.png";
import logoEquipa from "../images/logo-equipa.png";
import { Box, Grid, Tabs, Tab } from "@mui/material";
import UserPage from "../userProfileComponents/UserPage";
import StatisticsPage from "../statisticsComponents/StatisticsPage";
import AdminUsers from "../admins/AdminUsers";
import AdminParcels from "../admins/AdminParcels";
import AdminRewards from "../admins/AdminRewards";

export default function NavbarSU() {
    const [selectedLeftTab, setSelectedLeftTab] = react.useState(0);
    const [onlyPassword, setOnlyPassword] = react.useState(false);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('user')).points < 0) {
            setOnlyPassword(true)
        }
    }, [])

    function changeOnlyPassword() {
        if (JSON.parse(localStorage.getItem('user')).points < 0) {
            setOnlyPassword(true)
        }else {
            setOnlyPassword(false)
        }
    }

    const handleChangeLeft = (event, newValue) => {
        setSelectedLeftTab(newValue);
    };

    return (
        <>
            <Grid container direction="row" bgcolor="#D3D3D3" height="165px"  >
                <Grid item xs={2}  >
                    <Box component="img" src={logoProduto} width="300px" sx={{ mt: "5px" }} />
                </Grid>

                <Grid item xs={8} container direction="row" alignItems="flex-end" justify="center">
                    <Tabs textColor='inherit'
                        TabIndicatorProps={{ sx: { background: "black" } }}
                        value={selectedLeftTab}
                        onChange={handleChangeLeft}
                        variant="scrollable"
                        scrollButtons
                    >
                        <Tab sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Perfil" />
                        <Tab disabled={onlyPassword} sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Utilizadores" />
                        <Tab disabled={onlyPassword} sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Parcelas" />
                        <Tab disabled={onlyPassword} sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Recompensas" />
                        <Tab disabled={onlyPassword} sx={{ bgcolor: "whitesmoke", color: "darkgreen" }} label="Estatísticas" />

                    </Tabs>
                </Grid>
                <Grid item xs={2}>
                    <Box component="img" src={logoEquipa} width="310px" sx={{ ml: "auto", display: "flex" }} />
                </Grid>
            </Grid>
            {selectedLeftTab === 0 && <UserPage onClickFun1={changeOnlyPassword} />}
            {selectedLeftTab === 1 && <AdminUsers />}
            {selectedLeftTab === 2 && <AdminParcels />}
            {selectedLeftTab === 3 && <AdminRewards />}
            {selectedLeftTab === 4 && <StatisticsPage />}
        </>
    )
}