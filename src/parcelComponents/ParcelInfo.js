import { Box, Typography, Grid, Paper, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import mapsAvatar from "../images/maps-avatar.png";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import { Data, GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export default function ParcelInfo() {

    const [parcelName, setParcelName] = react.useState("")
    const [parcelDist, setParcelDist] = react.useState("")
    const [parcelCounty, setParcelCounty] = react.useState("")
    const [parcelFreg, setParcelFreg] = react.useState("")
    const [description, setDescription] = react.useState("")
    const [groundType, setGroundType] = react.useState("")
    const [currUsage, setCurrUsage] = react.useState("")
    const [prevUsage, setPrevUsage] = react.useState("")
    const [area, setArea] = react.useState("")
    const [allLats, setAllLats] = react.useState("")
    const [allLngs, setAllLngs] = react.useState("")
    const [chosenParcel, setChosenParcel] = react.useState("")
    const [markers, setMarkers] = react.useState([])
    const [loaded, setLoaded] = react.useState(false)

    var parcels = JSON.parse(localStorage.getItem('parcels'))

    useEffect(() => {
        const temp = []
        if(parcels != null) {
            if(parcels[chosenParcel] != null) {
                parcels[chosenParcel].markers.map(marker => {
                    temp.push({
                        lat: marker.latitude,
                        lng: marker.longitude,
                        time: new Date()
                    })
                })
                setMarkers(temp)
            }
           
            var parcel = parcels[chosenParcel]
            if(parcel != null) {
                setParcelName(parcel.parcelName);
                setParcelDist(parcel.district);
                setParcelCounty(parcel.county);
                setParcelFreg(parcel.freguesia);
                setDescription(parcel.description);
                setGroundType(parcel.groundType);
                setCurrUsage(parcel.currUsage);
                setPrevUsage(parcel.prevUsage);
                setArea(parcel.area);
            }
        }

    }, [chosenParcel])
    

    function setLats(parcel, size) {
        const tempLats = []
        for (var i = 0; i < size; i++) {
            tempLats.push(parcel.markers[i].latitude)
        }
        return tempLats;
    }

    function setLngs(parcel, size) {
        const tempLngs = []
        for (var i = 0; i < size; i++) {
            tempLngs.push(parcel.markers[i].longitude)
        }
        return tempLngs;
    }

    function setAttributes(event) {
        var parcel = parcels[event.target.value]
        setChosenParcel(event.target.value)
        setAllLats(setLats(parcel, parcel.markers.length));
        setAllLngs(setLngs(parcel, parcel.markers.length));
    }

    useEffect(() => {
        restCalls.parcelInfo().then(() => { setLoaded(true) })
    })

    function generateSelects() {
        const views = []
        if (parcels == null || parcels.length === 0)
            return <Typography> Não há parcelas registadas</Typography>
        else
            for (var i = 0; i < parcels.length; i++) {
                views.push(
                    <MenuItem
                        key={i}
                        value={i}
                    >
                        {parcels[i].parcelName}
                    </MenuItem>
                )
            }
        return views;
    }

    return (
        <>
            <Grid item xs={1.5} >
                <FormControl variant="standard">
                    <InputLabel id="id">Parcels</InputLabel>
                    <Select label="parcels" value={chosenParcel} onChange={setAttributes} sx={{ width: "150px" }}>
                        {loaded && generateSelects()}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={4.5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Name: {parcelName} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> District: {parcelDist} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> County: {parcelCounty} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Freg: {parcelFreg} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}>  Description: {description} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Ground Type: {groundType}</Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Current Usage: {currUsage}  </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Previous Usage: {prevUsage} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Area: {area} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={4}>
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    {(parcels != null && parcels[chosenParcel] != null) &&
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "100%" }}
                            center={{ lat: parcels[chosenParcel].markers[0].latitude, lng: parcels[chosenParcel].markers[0].longitude }}
                            zoom={13}
                        >
                            {parcels[chosenParcel].markers.map(marker => (
                                <Marker
                                    position={{ lat: marker.latitude, lng: marker.longitude }}
                                />

                            ))}
                            <Polygon
                                paths={markers}
                                onClick={() => this.handleClick()}
                                options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor: "#191970" }}
                            />

                            { /* Child components, such as markers, info windows, etc. */}
                        </GoogleMap>
                    }
                </LoadScript>
            </Grid>
        </>
    )
}