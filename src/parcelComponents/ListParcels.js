import { Box, Typography, Grid, ButtonGroup, Autocomplete, TextField, Button, Alert, CircularProgress } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import locais from "../locais/distritos.txt"
import { Data, GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export default function ListParcels() {

    const [chosenParcel, setChosenParcel] = react.useState()
    const [parcelIndex, setParcelIndex] = react.useState("")
    const [parcelName, setParcelName] = react.useState("")
    const [owner, setOwner] = react.useState("")
    const [owners, setOwners] = react.useState([])
    const [dist, setDist] = react.useState(null)
    const [conc, setConc] = react.useState(null)
    const [freg, setFreg] = react.useState(null)
    const [description, setDescription] = react.useState("")
    const [groundType, setGroundType] = react.useState("")
    const [currUsage, setCurrUsage] = react.useState("")
    const [prevUsage, setPrevUsage] = react.useState("")
    const [area, setArea] = react.useState("")
    const [allParcels, setAllParcels] = react.useState([])
    const [markers, setMarkers] = react.useState([])
    const [markersMem, setMarkersMem] = react.useState([])
    const [allDist, setAllDist] = react.useState([])
    const [allConc, setAllConc] = react.useState([])
    const [allFreg, setAllFreg] = react.useState([])
    const [allLats, setAllLats] = react.useState([])
    const [allLngs, setAllLngs] = react.useState([])
    const [allLatsMem, setAllLatsMem] = react.useState([])
    const [allLngsMem, setAllLngsMem] = react.useState([])
    const [distToConcState, setDistToConc] = react.useState()
    const [concToFregState, setConcToFreg] = react.useState()
    const [parcel, setParcel] = react.useState([])
    const [isParcelRemoved, setIsParcelRemoved] = react.useState(false)
    const [isParcelNotRemoved, setIsParcelNotRemoved] = react.useState(true)
    const [displayMessage, setDisplayMessage] = react.useState(false)
    const [isParcelModified, setIsParcelModified] = react.useState(false)
    const [isParcelNotModified, setIsParcelNotModified] = react.useState(true)
    const [displayModifyMessage, setDisplayModifyMessage] = react.useState(false)
    const [loadButtons, setLoadButtons] = react.useState(false)
    const [loaded, setLoaded] = react.useState(false)
    const [showProgress, setShowProgress] = react.useState(false)

    var parcels = JSON.parse(localStorage.getItem('allParcels'))

    useEffect(() => {
        restCalls.listAllParcels().then(() => { setLoaded(true); parcels = JSON.parse(localStorage.getItem('allParcels')) })
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

    useEffect(() => {
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
                    setLoadButtons(true)
                }
                i++
            })
        }
    }, [parcel])


    useEffect(() => {
        if (distToConcState != null && concToFregState != null) {
            if (distToConcState.has(dist)) {
                var temp = distToConcState.get(dist)
                setAllConc(temp)
            }
            if (concToFregState.has(conc)) {
                var temp = concToFregState.get(conc)
                setAllFreg(temp)
            }
        }
    }, [dist, conc])


    useEffect(() => {
        var split = []
        let distToConc = new Map()
        let concToFreg = new Map()
        let distritos = [];
        let concelhos = [];
        let freguesias = [];
        fetch(locais)
            .then(r => r.text())
            .then(text => {
                split = text.split(";")

                for (let i = 0; i < split.length; i++) {
                    var elem = split[i]
                    if (i % 3 == 0) {
                        if (!distToConc.has(elem)) {
                            distToConc.set(elem, [])
                            distritos.push(elem)
                        }
                        if (distToConc.get(elem).indexOf(split[i + 1]) == -1)
                            distToConc.get(elem).push(split[i + 1])
                    }
                    else if (i % 3 == 1) {
                        if (!concToFreg.has(elem)) {
                            concToFreg.set(elem, [])
                            concelhos.push(elem)
                        }
                        if (concToFreg.get(elem).indexOf(split[i + 1]) == -1)
                            concToFreg.get(elem).push(split[i + 1])
                    }
                    else {
                        if (freguesias.indexOf(elem) == -1)
                            freguesias.push(elem)
                    }
                }

                setAllDist(distritos)
                setAllConc(concelhos)
                setAllFreg(freguesias)
                setDistToConc(distToConc)
                setConcToFreg(concToFreg)
            });
    }, [])

    function deleteMarkers() {
        setMarkers([])
        setAllLats([])
        setAllLngs([])
    }

    function resetMarkers() {
        setMarkers(markersMem)
        setAllLats(allLatsMem)
        setAllLngs(allLngsMem)
    }


    function parcelRemoval() {
        if (chosenParcel != null) {
            setShowProgress(true)
            restCalls.deleteParcel(chosenParcel, owner)
                .then(() => { setLoaded(false); restCalls.listAllParcels(); setShowProgress(false); setIsParcelRemoved(true); setIsParcelNotRemoved(false); setDisplayMessage(true); restCalls.listAllParcels().then(() => { setLoaded(true); parcels = JSON.parse(localStorage.getItem('allParcels')) }) })
                .catch(() => { setIsParcelRemoved(false); setShowProgress(false); setIsParcelNotRemoved(true); setDisplayMessage(true) })
            setDisplayModifyMessage(false)
        } else {
            setIsParcelRemoved(false);
            setIsParcelNotRemoved(true);
            setDisplayMessage(true)
        }
    }

    function modifyParcelManager() {
        setShowProgress(true)
        restCalls.modifyParcel(owner, owners, parcelName, description, groundType, currUsage, prevUsage, allLats, allLngs)
            .then(() => { setLoaded(false); setIsParcelModified(true); setShowProgress(false); setIsParcelNotModified(false); setDisplayModifyMessage(true); restCalls.listAllParcels().then(() => { setLoaded(true); parcels = JSON.parse(localStorage.getItem('allParcels')) }) })
            .catch(() => { setIsParcelModified(false); setShowProgress(false); setIsParcelNotModified(true); setDisplayModifyMessage(true) })
        setDisplayMessage(false)
    }

    return (
        <>
            <Grid item xs={2} >
                <Autocomplete
                    selectOnFocus
                    id="parcels"
                    options={allParcels != null ? allParcels : []}
                    getOptionLabel={option => option.parcelName}
                    onChange={(event, newChosenParcel) => {
                        setChosenParcel(newChosenParcel.parcelName);
                        setParcel(newChosenParcel)
                    }}
                    sx={{ width: "80%", mt: 2 }}
                    renderInput={(params) => <TextField {...params} label="Parcelas" />}
                />

                <Button onClick={parcelRemoval} variant="contained" size="large" color="error" sx={{ width: "80%", mt: 2 }}>Remover Parcela</Button>
            </Grid>
            <Grid item xs={4} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="owner"
                        label="Dono da Parcela"
                        value={owner}
                        id="owner"
                        color="success"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="owners"
                        label="Outros donos da Parcela"
                        value={owners}
                        id="owners"
                        color="success"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="parcelName"
                        label="Nome da Parcela"
                        value={parcelName}
                        id="parcelName"
                        color="success"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <Autocomplete
                        disabled
                        selectOnFocus
                        id="distritos"
                        options={allDist}
                        getOptionLabel={option => option}
                        value={dist}
                        onChange={(_event, newDistrict) => {
                            setDist(newDistrict);
                            setConc(null)
                            setFreg(null)
                            if (dist.length > 0) {
                                if (distToConcState.has(newDistrict)) {
                                    var temp = distToConcState.get(newDistrict)
                                    setAllConc(temp)
                                }
                            }
                        }}
                        getOptionSelected={(option, value) => option === value}
                        sx={{ width: 400, mt: 1 }}
                        renderInput={(params) => <TextField {...params} label="Distrito" />}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <Autocomplete
                        disabled
                        selectOnFocus
                        id="concelhos"
                        options={allConc}
                        getOptionLabel={option => option}
                        value={conc}
                        onChange={(_event, newConc) => {
                            setConc(newConc);
                            setFreg(null)
                            if (dist.length > 0) {
                                if (concToFregState.has(newConc)) {
                                    var temp = concToFregState.get(newConc)
                                    setAllFreg(temp)
                                }
                            }
                        }}
                        sx={{ width: 400, mt: 2 }}
                        renderInput={(params) => <TextField {...params} label="Concelho" />}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <Autocomplete
                        disabled
                        selectOnFocus
                        id="freguesias"
                        options={allFreg}
                        getOptionLabel={option => option}
                        value={freg}
                        onChange={(_event, newFreg) => {
                            setFreg(newFreg);
                        }}
                        sx={{ width: 400, mt: 2 }}
                        renderInput={(params) => <TextField {...params} label="Freguesia" />}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="description"
                        label="Descrição"
                        value={description}
                        id="description"
                        color="success"
                        onChange={(event) => {
                            setDescription(event.target.value)
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="groundType"
                        label="Tipo de Cobertura do Solo"
                        value={groundType}
                        id="groundType"
                        color="success"
                        onChange={(event) => {
                            setGroundType(event.target.value)
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="currUsage"
                        label="Utilização Atual"
                        value={currUsage}
                        id="currUsage"
                        color="success"
                        onChange={(event) => {
                            setCurrUsage(event.target.value)
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="prevUsage"
                        label="Utilização prévia"
                        value={prevUsage}
                        id="prevUsage"
                        color="success"
                        onChange={(event) => {
                            setPrevUsage(event.target.value)
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="area"
                        label="Área"
                        value={area}
                        id="area"
                        color="success"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    sx={{ width: "92%", mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={modifyParcelManager}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar Parcela </Typography>
                </Button>
            </Grid>
            <Grid item xs={4}>

                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    {(parcels != null && parcels[parcelIndex] != null) &&
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "60%" }}
                            center={{ lat: parcels[parcelIndex].markers[0].latitude, lng: parcels[parcelIndex].markers[0].longitude }}
                            zoom={13}
                            onClick={(event) => {
                                setMarkers(current => [
                                    ...current,
                                    {
                                        lat: event.latLng.lat(),
                                        lng: event.latLng.lng()
                                    },
                                ]);
                                allLats.push(event.latLng.lat())
                                allLngs.push(event.latLng.lng())
                            }}
                        >
                            {markers.map(marker => (
                                <Marker
                                    position={{ lat: marker.lat, lng: marker.lng }}
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
                {loadButtons &&
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button color="error" onClick={deleteMarkers}>Delete Markers</Button>
                        <Button color="success" onClick={resetMarkers}>Reset Markers</Button>
                    </ButtonGroup>
                }


                {(isParcelRemoved && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela removida com sucesso.</Typography>
                    </Alert> : <></>}
                {(isParcelNotRemoved && displayMessage) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção da parcela.</Typography>
                    </Alert> : <></>
                }

                {(!loaded || showProgress) && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "40%", left: "50%", overflow: "auto" }} />}
                {(isParcelModified && displayModifyMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela modificada com sucesso.</Typography>
                    </Alert> : <></>}
                {(isParcelNotModified && displayModifyMessage) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na modificação da parcela.</Typography>
                    </Alert> : <></>
                }
            </Grid>
        </>
    )
}