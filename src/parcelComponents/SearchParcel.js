import react, { useEffect } from 'react';
import restCalls from "../restCalls";
import { Box, Grid, FormControl, Radio, FormControlLabel, FormLabel, Select, InputLabel, MenuItem, RadioGroup, Paper, Typography, Button, TextField, Autocomplete } from "@mui/material";
import { Data, GoogleMap, LoadScript, Polyline, Polygon } from '@react-google-maps/api';
import locais from "../locais/distritos.txt"
import { SettingsSystemDaydreamOutlined } from '@mui/icons-material';

export default function SearchParcel() {

    const [latMax, setLatMax] = react.useState(0);
    const [latMin, setLatMin] = react.useState(0);
    const [lngMax, setLngMax] = react.useState(0);
    const [lngMin, setLngMin] = react.useState(0);
    const [markers, setMarkers] = react.useState([]);
    const [polygonMarkers, setPolygonMarkers] = react.useState([]);
    const [polygonList, setPolygonList] = react.useState([]);
    const [firstAux, setFirstAux] = react.useState([]);
    const [secondAux, setSecondAux] = react.useState([]);
    const [thirdAux, setThirdAux] = react.useState([]);
    const [fourthAux, setFourthAux] = react.useState([]);
    const [option, setOption] = react.useState("region");
    const [first, setFirst] = react.useState(false);
    const [second, setSecond] = react.useState(false);
    const [third, setThird] = react.useState(false);
    const [fourth, setFourth] = react.useState(false);
    const [renderPolygons, setRenderPolygons] = react.useState(false);
    const [dist, setDist] = react.useState([]);
    const [conc, setConc] = react.useState([]);
    const [freg, setFreg] = react.useState([]);
    const [chosenDist, setChosenDist] = react.useState(null);
    const [chosenConc, setChosenConc] = react.useState(null);
    const [chosenFreg, setChosenFreg] = react.useState(null);
    const [type, setType] = react.useState(-1);
    const [region, setRegion] = react.useState(null);
    const [loaded, setLoaded] = react.useState(true)
    const [chosenParcel, setChosenParcel] = react.useState("")
    const [allSearchedParcels, setAllSearchedParcels] = react.useState([])
    const [owner, setOwner] = react.useState("")
    const [email, setEmail] = react.useState("")
    const [center, setCenter] = react.useState({ lat: 39.417, lng: -8.33 })


    var temp;
    const maxLatPt = 42.1543;
    const minLatPt = 36.9597;
    const maxLngPt = -6.1890;
    const minLngPt = -9.5006;

    useEffect(() => {
        let split = [];
        let distritos = [];
        let concelhos = [];
        let freguesias = [];
        fetch(locais)
            .then(r => r.text())
            .then(text => {
                split = text.split(";")

                for (let i = 0; i < split.length; i++) {
                    if (i % 3 == 0 && distritos.indexOf(split[i]) == -1) distritos.push(split[i]);
                    else if (i % 3 == 1 && concelhos.indexOf(split[i]) == -1) concelhos.push(split[i]);
                    else if (i % 3 == 2 && freguesias.indexOf(split[i]) == -1) freguesias.push(split[i]);
                }
                setDist(distritos)
                setConc(concelhos)
                setFreg(freguesias)
            });
    }, [])

    useEffect(() => {
        if (markers.length == 0) {
            setFirst(false);
            setSecond(false);
            setThird(false);
            setFourth(false);
            setFirstAux([]);
            setSecondAux([]);
            setThirdAux([]);
            setFourthAux([]);
        }
        else if (markers.length == 1) {
            setFirst(true);
            setSecond(false);
            setThird(false);
            setFourth(false);
            temp = { lat: markers[0].lat, lng: minLngPt }
            firstAux.push(temp);
            temp = { lat: markers[0].lat, lng: maxLngPt }
            firstAux.push(temp);
            setLatMax(markers[0].lat)
        }
        else if (markers.length == 2) {
            setFirst(true);
            setSecond(true);
            setThird(false);
            setFourth(false);
            temp = { lat: markers[1].lat, lng: maxLngPt }
            secondAux.push(temp);
            temp = { lat: markers[1].lat, lng: minLngPt }
            secondAux.push(temp);
            setLatMin(markers[1].lat)
        }
        else if (markers.length == 3) {
            setFirst(true);
            setSecond(true);
            setThird(true);
            setFourth(false);
            temp = { lat: latMax, lng: markers[2].lng }
            thirdAux.push(temp);
            temp = { lat: latMin, lng: markers[2].lng }
            thirdAux.push(temp);
            setLngMax(markers[2].lng)
        }
        else {
            setFirst(true);
            setSecond(true);
            setThird(true);
            setFourth(true);
            temp = { lat: latMax, lng: markers[3].lng }
            fourthAux.push(temp);
            temp = { lat: latMin, lng: markers[3].lng }
            fourthAux.push(temp);
            setLngMin(markers[3].lng)
            adjustLines();
        }
    }, [markers])


    function adjustLines() {
        let firstTemp = []
        temp = { lat: latMax, lng: lngMax }
        firstTemp.push(temp)
        temp = { lat: latMax, lng: markers[3].lng }
        firstTemp.push(temp)
        setFirstAux(firstTemp)

        firstTemp = []
        temp = { lat: latMin, lng: lngMax }
        firstTemp.push(temp)
        temp = { lat: latMin, lng: markers[3].lng }
        firstTemp.push(temp)
        setSecondAux(firstTemp)
    }

    function deleteMarkers() {
        setMarkers([]);
        setLatMax(0);
        setLatMin(0);
        setLngMax(0);
        setLngMin(0);
        setPolygonMarkers([]);
        setRenderPolygons(false);
        setOwner("")
        setEmail("")
        setChosenParcel("")
    }

    function getData() {
        var list;
        setRenderPolygons(false)
        if (markers.length === 4) {
            list = []
            if (option === "limits") {
                restCalls.getParcelsByPosition(latMax, latMin, lngMax, markers[3].lng).then(() => { updatePolygonMarkers(); setLoaded(true) })
            }
        }
        else if (type !== -1) {
            list = []
            restCalls.getParcelsByRegion(region, type).then(() => { updatePolygonMarkers(); setLoaded(true) })
        }
    }

    function updatePolygonMarkers() {
        var searchedParcels = JSON.parse(localStorage.getItem("parcelsSearch"))
        var list = []
        if (searchedParcels != null && searchedParcels.length > 0) {
            searchedParcels.map((parcel) => {
                list.push(parcel)
            })
            setPolygonMarkers([...searchedParcels])
            setRenderPolygons(true)
        }
        else {
            setPolygonMarkers([])
        }
    }


    useEffect(() => {
        var searchedParcels = JSON.parse(localStorage.getItem("parcelsSearch"))
        setAllSearchedParcels(searchedParcels)
        generateSelects()
        var list = [];
        var polygonListMem = [];
        var id = 0;
        if (polygonMarkers.length > 0) {
            polygonMarkers.map((parcel) => {
                list = []
                parcel.markers.map((marker) => {
                    var mem = {
                        lat: marker.latitude,
                        lng: marker.longitude
                    }
                    list.push(mem)
                })

                var polygonMem = <Polygon
                    path={list}
                    options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor: "#191970" }}
                    key={id++}
                />
                polygonListMem.push(polygonMem);
            })
            setPolygonList(polygonListMem)
        }
        else {
            setPolygonList([])
        }
    }, [polygonMarkers])

    function generateSelects() {
        var searchedParcels = JSON.parse(localStorage.getItem("parcelsSearch"))
        const views = []
        if (searchedParcels == null || searchedParcels.length === 0)
            return <Typography> Não existem parcelas </Typography>
        else
            for (var i = 0; i < searchedParcels.length; i++) {
                views.push(
                    <MenuItem
                        key={i}
                        value={i}
                    >
                        {searchedParcels[i].parcelName}
                    </MenuItem>
                )
            }
        return views;
    }

    function optionHandler(e) {
        if (e.target.value === "limits") {
            setType(-1)
            setChosenDist(null)
            setChosenConc(null)
            setChosenFreg(null)
        }
        setOption(e.target.value);
        setMarkers([]);
        setFirstAux([]);
        setSecondAux([]);
        setThirdAux([]);
        setFourthAux([]);
        setPolygonMarkers([]);
        setPolygonList([]);
        setOwner("")
        setEmail("")
        setChosenParcel("")
    }

    function setAttributes(event) {
        var ownerInfo;
        var parcel = allSearchedParcels[event.target.value]
        restCalls.ownerInfo(parcel.owner).then(() => { ownerInfo = JSON.parse(localStorage.getItem("owner")); setEmail(ownerInfo.email) })
        setChosenParcel(event.target.value)
        setOwner(parcel.owner)
        setCenter({ lat: parcel.markers[0].latitude, lng: parcel.markers[0].longitude })
    }

    return (
        <>
            <Grid item xs={1.5} >
                <FormControl variant="standard">
                    <InputLabel id="id">Parcelas</InputLabel>
                    <Select label="parcels" value={chosenParcel} onChange={setAttributes} sx={{ width: "150px" }}>
                        {loaded && generateSelects()}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={5.5}>
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "600px" }}
                        center={{ lat: center.lat, lng: center.lng }}
                        zoom={7}
                        onClick={(event) => {
                            if (option == "limits" && markers.length < 4) {
                                setMarkers(current => [
                                    ...current,
                                    {
                                        lat: event.latLng.lat(),
                                        lng: event.latLng.lng()
                                    },
                                ]);
                            }
                        }}
                    >
                        {firstAux.length > 0 &&
                            <Polyline
                                path={firstAux}
                                options={{ strokeOpacity: 0.5 }}
                            />
                        }
                        {secondAux.length > 0 &&
                            <Polyline
                                path={secondAux}
                                options={{ strokeOpacity: 0.5 }}
                            />
                        }
                        {thirdAux.length > 0 &&
                            <Polyline
                                path={thirdAux}
                                options={{ strokeOpacity: 0.5 }}
                            />
                        }
                        {fourthAux.length > 0 &&
                            <Polyline
                                path={fourthAux}
                                options={{ strokeOpacity: 0.5 }}
                            />
                        }

                        {/*(renderPolygons || option == "region") && getPolygons()*/}
                        {(renderPolygons || option == "region") && polygonList}

                    </GoogleMap>
                </LoadScript>
                <Button size="large" color="info" onClick={deleteMarkers} >nova pesquisa</Button>
            </Grid>
            <Grid item xs={3}>
                <Box sx={{
                    marginTop: 2
                }}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"><Typography color="black" fontSize={20}>Pesquisa de parcelas: </Typography></FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={option}
                            onChange={optionHandler}
                        >
                            <FormControlLabel value="region" control={<Radio color="success" />} label="Região" />
                            <FormControlLabel value="limits" control={<Radio color="success" />} label="Limites" />
                        </RadioGroup>
                    </FormControl>

                    {option == "limits" ?
                        <>
                            <Typography mt={1} pl={9} align="left" color={first ? "darkgreen" : "error"}>1. Clique no mapa para definir o limite a norte</Typography>
                            <Typography mt={1} pl={9} align="left" color={second ? "darkgreen" : "error"}>2. Clique no mapa para definir o limite a sul</Typography>
                            <Typography mt={1} pl={9} align="left" color={third ? "darkgreen" : "error"}>3. Clique no mapa para definir o limite a este</Typography>
                            <Typography mt={1} pl={9} align="left" color={fourth ? "darkgreen" : "error"}>4. Clique no mapa para definir o limite a oeste</Typography>
                        </>
                        :
                        <Box>
                            <Typography>Selecione uma localização</Typography>
                            <Autocomplete
                                selectOnFocus
                                id="distritos"
                                options={dist}
                                getOptionLabel={option => option}
                                value={chosenDist}
                                onChange={(_event, newDistrict) => {
                                    setChosenDist(newDistrict);
                                    setChosenConc(null);
                                    setChosenFreg(null);
                                    setRegion(newDistrict)
                                    setType(2)
                                    setOwner("")
                                    setEmail("")
                                }}
                                sx={{ width: 400, mt: 1 }}
                                renderInput={(params) => <TextField {...params} label="Distrito" />}
                            />
                            <Autocomplete
                                selectOnFocus
                                id="concelhos"
                                options={conc}
                                getOptionLabel={option => option}
                                value={chosenConc}
                                onChange={(_event, newConc) => {
                                    setChosenConc(newConc);
                                    setChosenDist(null);
                                    setChosenFreg(null);
                                    setRegion(newConc)
                                    setType(1)
                                    setOwner("")
                                    setEmail("")
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Concelho" />}
                            />
                            <Autocomplete
                                selectOnFocus
                                id="freguesias"
                                options={freg}
                                getOptionLabel={option => option}
                                value={chosenFreg}
                                onChange={(_event, newFreg) => {
                                    setChosenFreg(newFreg);
                                    setChosenConc(null);
                                    setChosenDist(null);
                                    setOwner("")
                                    setEmail("")
                                    setRegion(newFreg)
                                    setType(3)
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Freguesia" />}
                            />
                        </Box>
                    }

                    <Button variant="contained" color="success" size="large" onClick={getData} sx={{ mt: 2 }}> <Typography variant="h6" size="large"> Avançar </Typography> </Button>
                    {(email !== "" && owner !== "") &&
                        <div>
                            <Box p={2.5} textAlign="center" >
                                <Paper elevation={12}>
                                    <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 14 }}> Dono da Parcela: {allSearchedParcels[chosenParcel].owner}  </Typography>
                                </Paper>
                            </Box>
                            <Box p={2.5} textAlign="center" >
                                <Paper elevation={12}>
                                    <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 14 }}> Email: {email}</Typography>
                                </Paper>
                            </Box>
                        </div>
                    }
                </Box>
            </Grid>
        </>
    )
}