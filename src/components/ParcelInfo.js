import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import mapsAvatar from "../images/maps-avatar.png";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";

export default function ParcelInfo() {

    const [parcelName, setParcelName] = react.useState("")
    const [parcelRegion, setParcelRegion] = react.useState("")
    const [description, setDescription] = react.useState("")
    const [groundType, setGroundType] = react.useState("")
    const [currUsage, setCurrUsage] = react.useState("")
    const [prevUsage, setPrevUsage] = react.useState("")
    const [area, setArea] = react.useState("")
    const [allLats, setAllLats] = react.useState("")
    const [allLngs, setAllLngs] = react.useState("")

    var parcels = JSON.parse(localStorage.getItem('parcels'))


    function xyz(i) {
        setParcelName(parcels[i].parcelName);
        setParcelRegion(parcels[i].parcelRegion);
        setDescription(parcels[i].description);
        setGroundType(parcels[i].groundType);
        setCurrUsage(parcels[i].currUsage);
        setPrevUsage(parcels[i].prevUsage);
        setArea(parcels[i].area);
        setAllLats(parcels[i].allLats);
        setAllLngs(parcels[i].allLngs);
    }
   
    /*
    const generateButtons = () => {
        for (var i = 0; i <= parcels.length; i++) {
            return <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, height: "40px" }}
                        onClick={() => { xyz(i) }}
                    >
                        {parcels[i].parcelName}
                    </Button>
            
       }
    }
    */

    return (
        <>
            <Grid item xs={1.5}>
            </Grid>
            <Grid item xs={5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Name: {parcelName} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Region: {parcelRegion} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 18 }}>  Description: {description} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Ground Type: {groundType}</Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Current Usage: {currUsage}  </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Previous Usage: {prevUsage} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Area: {area} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 13 }}> Pontos(latitudes): {allLats} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{ fontFamily: 'Verdana', fontSize: 13 }}> Pontos(Longitudes): {allLngs} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={3.5}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <Box component="img" src={mapsAvatar} sx={{ height: "350px", width: "350px" }} />
            </Grid>
        </>
    )
}