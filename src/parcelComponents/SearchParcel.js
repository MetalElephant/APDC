import react, { useEffect } from 'react';
import restCalls from "../restCalls";
import { Box, Grid, FormControl, Radio, FormControlLabel, FormLabel, RadioGroup, Typography, Button, TextField, Autocomplete } from "@mui/material";
import { Data, GoogleMap, LoadScript, Polyline, Polygon } from '@react-google-maps/api';
import locais from "../locais/distritos.txt"

export default function SearchParcel() {

    const [chosenParcel, setChosenParcel] = react.useState("");
    const [latMax, setLatMax] = react.useState(0);
    const [latMin, setLatMin] = react.useState(0);
    const [lngMax, setLngMax] = react.useState(0);
    const [lngMin, setLngMin] = react.useState(0);
    const [markers, setMarkers] = react.useState([]);
    const [polygonMarkers, setPolygonMarkers] = react.useState([]);
    const [firstAux, setFirstAux] = react.useState([]);
    const [secondAux, setSecondAux] = react.useState([]);
    const [thirdAux, setThirdAux] = react.useState([]);
    const [fourthAux, setFourthAux] = react.useState([]);
    const [loaded, setLoaded] = react.useState(false);
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


    var temp;
    var searchedParcels;

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
    }

    function getData() {
        setRenderPolygons(false)
        if (markers.length === 4) {
            var list = []
            if (option === "limits") {
                console.log("limitessss")
                restCalls.getParcelsByPosition(latMax, latMin, lngMax, markers[3].lng);
                searchedParcels = JSON.parse(localStorage.getItem("parcelsSearch"))
            }

        }
        else if (type !== -1) {
            list = []
            restCalls.getParcelsByRegion(region, type);
            searchedParcels = JSON.parse(localStorage.getItem("parcelsSearch"))
        }

        if (searchedParcels != null && searchedParcels.length > 0) {
            console.log("rendering parcels...")
            searchedParcels.map((parcel) => {
                list.push(parcel)
            })
            setPolygonMarkers([...list]);
            setRenderPolygons(true)
        }

    }

    function getPolygons() {
        var list = [];
        var polygonList = [];
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
                polygonList.push(polygonMem);
            })
        }


        return polygonList
    }

    function optionHandler(e) {
        if(e.target.value === "limits") {
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
    }

    return (
        <>
            <Grid item xs={7}>
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "600px" }}
                        center={{ lat: 39.639538, lng: -8.088107 }}
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

                        {(renderPolygons || option == "region") && getPolygons()}

                    </GoogleMap>
                </LoadScript>
                <Button color="error" onClick={deleteMarkers} >nova pesquisa</Button>
            </Grid>
            <Grid item xs={3}>
                <Box>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"><Typography color="black" fontSize={20}>Pesquisa de parcelas por: </Typography></FormLabel>
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
                        <Box>
                            <Typography color={first ? "darkgreen" : "error"}>1. Clique no mapa para definir o limite a norte</Typography>
                            <Typography color={second ? "darkgreen" : "error"}>2. Clique no mapa para definir o limite a sul</Typography>
                            <Typography color={third ? "darkgreen" : "error"}>3. Clique no mapa para definir o limite a este</Typography>
                            <Typography color={fourth ? "darkgreen" : "error"}>4. Clique no mapa para definir o limite a oeste</Typography>
                        </Box>
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
                                }}
                                sx={{ width: 400, mt: 1 }}
                                renderInput={(params) => <TextField {...params} label="Distrito *" />}
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
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Concelho *" />}
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
                                    setRegion(newFreg)
                                    setType(3)
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Freguesia *" />}
                            />
                        </Box>
                    }

                    <Button variant="contained" color="success" size="large" onClick={getData} sx={{ mt: 3 }}> <Typography variant="h6" size="large"> Avançar </Typography> </Button>
                </Box>
            </Grid>
        </>
    )
}