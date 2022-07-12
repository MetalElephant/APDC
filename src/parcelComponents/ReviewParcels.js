import { Box, Typography, Grid, CircularProgress, Button, Alert, Paper, TextField, ButtonGroup } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';

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
    const [confirmed, setConfirmed] = react.useState(false)
    const [confirmation, setConfirmation] = react.useState("")
    const [groundType, setGroundType] = react.useState("")
    const [currUsage, setCurrUsage] = react.useState("")
    const [prevUsage, setPrevUsage] = react.useState("")
    const [area, setArea] = react.useState("")
    const [allParcels, setAllParcels] = react.useState([])
    const [polygons, setPolygons] = react.useState([])
    const [polygonList, setPolygonList] = react.useState([])
    const [loaded, setLoaded] = react.useState(false)
    const [isParcelVerified, setIsParcelVerified] = react.useState(false)
    const [isParcelNotVerified, setIsParcelNotVerified] = react.useState(false)
    const [displayMessage, setDisplayMessage] = react.useState(0)
    const [isParcelRejected, setIsParcelRejected] = react.useState(false)
    const [isParcelNotRejected, setIsParcelNotRejected] = react.useState(false)
    const [displayError, setDisplayError] = react.useState(false)
    const [renderPolygons, setRenderPolygons] = react.useState(false)
    const [showProgress, setShowProgress] = react.useState(false)
    const [center, setCenter] = react.useState({ lat: 38.736946, lng: -9.142685 })
    const [zoom, setZoom] = react.useState(7)
    const [reason, setReason] = react.useState("");
    const [messageErr, setMessageErr] = react.useState(false)

    var parcels = JSON.parse(localStorage.getItem('parcelsRep'))

    useEffect(() => {
        restCalls.getParcelsRep()
            .then(() => { parcels = JSON.parse(localStorage.getItem('parcelsRep')); updatePolygons(); setLoaded(true) })
    }, [])

    useEffect(() => {
        var temp = []
        if (parcels != null) {
            parcels.map((parcel) => {
                temp.push(parcel)
            })
            setAllParcels(temp)
        }
    }, [loaded])

    function updateInfo(parcelName) {
        var index = allParcels.findIndex(parcel => parcel.parcelName === parcelName)
        var parcel = parcels[index]
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
        setConfirmed(parcel.confirmed)
        setConfirmation(parcel.confirmation)
        setCenter({ lat: parcel.markers[0].latitude, lng: parcel.markers[0].longitude })
        setZoom(12)
        var tempOwners = ""
        for (let i = 0; i < parcel.owners.length; i++) {
            if (i !== 0)
                tempOwners = tempOwners + ", " + parcel.owners[i]
            else
                tempOwners = parcel.owners[i]
        }
        setOwners(tempOwners)
    }

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
                        onClick={() => updateInfo(parcel.parcelName)}
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

    function verifyParcel() {
        setMessageErr(false)
        if (parcelName !== "" && !confirmed) {
            setShowProgress(true)
            setDisplayError(false)
            restCalls.verifyParcel(owner, parcelName, true, "")
                .then(() => { restCalls.getParcelsRep().then(() => { setShowProgress(false); setLoaded(false); parcels = JSON.parse(localStorage.getItem('parcelsRep')); setLoaded(true); updatePolygons() }); setIsParcelVerified(true); setDisplayMessage(0) })
                .catch(() => { setShowProgress(false); setIsParcelNotVerified(true); setDisplayMessage(1) })
            setDisplayMessage(true)
        }
        else {
            setDisplayError(true)
        }
    }

    function rejectParcel() {
        if(reason !== "") {
            setMessageErr(false)
            if (parcelName !== "" && !confirmed) {
                setShowProgress(true)
                setDisplayError(false)
                restCalls.verifyParcel(owner, parcelName, false, reason)
                    .then(() => { restCalls.getParcelsRep().then(() => { setShowProgress(false); setLoaded(false); parcels = JSON.parse(localStorage.getItem('parcelsRep')); setLoaded(true); updatePolygons() }); setIsParcelRejected(true); setDisplayMessage(2) })
                    .catch(() => { setShowProgress(false); setIsParcelNotRejected(true); setDisplayMessage(3)})
            }
            else {
                setDisplayError(true)
            }
        }
        else {
            setMessageErr(true)
        }
    }

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
                {confirmation !== "" &&
                    <Box p={2.5} textAlign="center" >
                        <Paper elevation={12}>
                            <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}>Consulte o documento <a href={confirmation} target="_blank">aqui</a></Typography>
                        </Paper>
                    </Box>
                }
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
                            center={center}
                            zoom={zoom}
                        >

                            {renderPolygons && polygonList}
                        </GoogleMap>
                    }
                </LoadScript>

                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "80%", overflow: "auto" }} />}



                <ButtonGroup variant="outlined" aria-label="outlined button group" sx={{ width: "80%" }}>
                    <Button onClick={verifyParcel} variant="contained" color="success" sx={{ mt: 2, width: "50%" }}>Verificar Parcela</Button>
                    <Button onClick={rejectParcel} variant="contained" color="error" sx={{ mt: 2, width: "50%" }}>Rejeitar Parcela</Button>
                </ButtonGroup>


                {displayError && <Typography p={0.5} color="error">Nenhuma parcela foi selecionada ou a parcela selecionada já foi verificada</Typography>}

                {(isParcelVerified && displayMessage === 0) &&
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela verificada com sucesso.</Typography>
                    </Alert>}
                {(isParcelNotVerified && displayMessage === 1) &&
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na verificação da parcela.</Typography>
                    </Alert>
                }

                {(isParcelRejected && displayMessage === 2) &&
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela rejeitada com sucesso.</Typography>
                    </Alert>}
                {(isParcelNotRejected && displayMessage === 3) &&
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao rejeitar a parcela.</Typography>
                    </Alert>
                }

                <TextField
                    sx={{ width: "80%", pt: 1 }}
                    color="success"
                    variant="outlined"
                    placeholder="No caso de rejeição de parcela, descreva o motivo..."
                    multiline
                    value={reason}
                    rows={5}
                    onChange={(event) => setReason(event.target.value)}
                />
                {messageErr && <Typography p={0.5} color="error">É obrigatório dar uma justificação da rejeição da parcela</Typography>}
            </Grid>
        </>
    )
}