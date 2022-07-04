import { Box, Typography, Grid, Autocomplete, TextField, Button, Alert, Paper } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export default function ReviewParcels() {

    const [chosenParcel, setChosenParcel] = react.useState()
    const [parcelIndex, setParcelIndex] = react.useState("")
    const [parcelName, setParcelName] = react.useState("")
    const [owner, setOwner] = react.useState("")
    const [owners, setOwners] = react.useState("")
    const [dist, setDist] = react.useState(null)
    const [conc, setConc] = react.useState(null)
    const [freg, setFreg] = react.useState(null)
    const [description, setDescription] = react.useState("")
    const [groundType, setGroundType] = react.useState("")
    const [currUsage, setCurrUsage] = react.useState("")
    const [prevUsage, setPrevUsage] = react.useState("")
    const [area, setArea] = react.useState("")
    const [allParcels, setAllParcels] = react.useState([])
    const [polygons, setPolygons] = react.useState([])
    const [polygonList, setPolygonList] = react.useState([])
    const [markers, setMarkers] = react.useState([])
    const [markersMem, setMarkersMem] = react.useState([])
    const [allLats, setAllLats] = react.useState([])
    const [allLngs, setAllLngs] = react.useState([])
    const [allLatsMem, setAllLatsMem] = react.useState([])
    const [allLngsMem, setAllLngsMem] = react.useState([])
    const [parcel, setParcel] = react.useState([])
    const [loaded, setLoaded] = react.useState(false)
    const [isParcelVerified, setIsParcelVerified] = react.useState(false)
    const [isParcelNotVerified, setIsParcelNotVerified] = react.useState(true)
    const [displayMessage, setDisplayMessage] = react.useState(false)
    const [renderPolygons, setRenderPolygons] = react.useState(false)

    var parcels = JSON.parse(localStorage.getItem('parcelsRep'))

    useEffect(() => {
        restCalls.getParcelsRep()
            .then(() => { setLoaded(true); parcels = JSON.parse(localStorage.getItem('parcelsRep')); updatePolygons() })
    }, [])

    useEffect(() => {
        setParcelName(parcel.parcelName)
        setOwner(parcel.owner)
        setDist(parcel.district)
        setConc(parcel.county)
        setFreg(parcel.freguesia)
        setDescription(parcel.description)
        setGroundType(parcel.groundType)
        setCurrUsage(parcel.currUsage)
        setPrevUsage(parcel.prevUsage)
        setArea(parcel.area)

        setOwners("")
        if (parcel.owners != null && parcel.owners.length > 0) {
            var tempOwners = ""
            for (let i = 0; i < parcel.owners.length; i++) {
                if (tempOwners === "")
                    tempOwners = parcel.owners[i]
                else if (parcel.owners[i] !== "" && parcel.owners[i] != null)
                    tempOwners = tempOwners + ", " + parcel.owners[i]
            }
            setOwners(tempOwners)
        }

        if (parcels != null && parcels.length > 0) {
            var i = 0;
            parcels.map((temp) => {
                if (temp.parcelName === parcel.parcelName) {
                    setParcelIndex(i)
                    var tempMarkers = []
                    var tempLats = []
                    var tempLngs = []
                    parcel.markers.map((marker) => {
                        tempMarkers.push({
                            lat: marker.latitude,
                            lng: marker.longitude
                        })
                        tempLats.push(marker.latitude)
                        tempLngs.push(marker.longitude)
                    })
                    setMarkers(tempMarkers)
                    setMarkersMem(tempMarkers)
                    setAllLats(tempLats)
                    setAllLatsMem(tempLats)
                    setAllLngs(tempLngs)
                    setAllLngsMem(tempLngs)
                }
                i++
            })
        }
    }, [parcel])

    useEffect(() => {
        var temp = []
        if (parcels != null) {
            parcels.map((parcel) => {
                temp.push(parcel)
            })
            setAllParcels(temp)
        }
    }, [loaded])

    function updatePolygons() {
        var tempPolygons = []
        if (parcels != null && parcels.length > 0) {
            parcels.map((parcel) => {
                tempPolygons.push(parcel)
            })
            setPolygons([...tempPolygons])
        }
        else {
            setPolygons([])
        }
    }

    function updateInfo(id) {
        var parcel = parcels[id]
        setParcelName(parcel.parcelName)
        setOwner(parcel.owner)
        setOwners(parcel.owners)
        setDist(parcel.district)
        setConc(parcel.county)
        setFreg(parcel.freguesia)
        setDescription(parcel.description)
        setGroundType(parcel.groundType)
        setCurrUsage(parcel.currUsage)
        setPrevUsage(parcel.prevUsage)
        setArea(parcel.area)
    }

    useEffect(() => {
        var list = [];
        var polygonListMem = [];
        var id = 0;
        if (polygons.length > 0) {
            polygons.map((parcel) => {
                list = []
                parcel.markers.map((marker) => {
                    var mem = {
                        lat: marker.latitude,
                        lng: marker.longitude
                    }
                    list.push(mem)
                })

                var polygonMem = 
                <Polygon
                    onClick={(event) => updateInfo(id++)}
                    path={list}
                    options={{ strokeOpacity: 0.8, strokeColor: parcel.confirmed ? "#006600" : "#FF0606", fillColor: parcel.confirmed ? "#006600" : "#FF0606" }}
                    key={id}
                />
                polygonListMem.push(polygonMem);
            })
            setPolygonList(polygonListMem)
        }
        else {
            setPolygonList([])
        }
        setRenderPolygons(true)
    }, [polygons])

    return (
        <>
            <Grid item xs={5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Dono da parcela: {owner} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Outros donos da parcela: {owners} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Nome da parcela: {parcelName} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Distrito: {dist} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Concelho: {conc} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Freguesia: {freg} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Descrição: {description} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Tipo de Cobertura do Solo: {groundType} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Utilização Atual: {currUsage} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Utilização Prévia: {prevUsage} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Área: {area} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={5}>

                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    {(parcels != null) &&
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "60%" }}
                            center={{ lat: 	38.736946, lng: -9.142685 }}
                            zoom={7}
                        >

                            {renderPolygons && polygonList}

                            {/*<Polygon
                                paths={markers}
                                onClick={() => this.handleClick()}
                                options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor: "#191970" }}
                            />*/}
                        </GoogleMap>
                    }
                </LoadScript>

                {(isParcelVerified && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela verificada com sucesso.</Typography>
                    </Alert> : <></>}
                {(isParcelNotVerified && displayMessage) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na verificação da parcela.</Typography>
                    </Alert> : <></>
                }
            </Grid>
        </>
    )
}