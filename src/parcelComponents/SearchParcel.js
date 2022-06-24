import react, { useEffect } from 'react';
import restCalls from "../restCalls";
import { Box, Grid, FormControl, Radio, FormControlLabel, FormLabel, RadioGroup, Typography, Button } from "@mui/material";
import { Data, GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

export default function SearchParcel() {

    const [chosenParcel, setChosenParcel] = react.useState("");
    const [latMax, setLatMax] = react.useState(0);
    const [latMin, setLatMin] = react.useState(0);
    const [lngMax, setLngMax] = react.useState(0);
    const [lngMin, setLngMin] = react.useState(0);
    const [markers, setMarkers] = react.useState([]);
    const [firstAux, setFirstAux] = react.useState([]);
    const [secondAux, setSecondAux] = react.useState([]);
    const [thirdAux, setThirdAux] = react.useState([]);
    const [forthAux, setForthAux] = react.useState([]);
    const [allLats, setAllLats] = react.useState([]);
    const [allLngs, setAllLngs] = react.useState([]);
    const [loaded, setLoaded] = react.useState(false);
    const [option, setOption] = react.useState("local");
    const [first, setFirst] = react.useState(false);
    const [second, setSecond] = react.useState(false);
    const [third, setThird] = react.useState(false);
    const [forth, setForth] = react.useState(false);

    var temp;

    const maxLatPt = 42.1543;
    const minLatPt = 36.9597;
    const maxLngPt = -6.1890;
    const minLngPt = -9.5006;

    useEffect(() => {
        if (markers.length == 0) {
            setFirst(false);
            setSecond(false);
            setThird(false);
            setForth(false);
        }
        else if (markers.length == 1) {
            setFirst(true);
            setSecond(false);
            setThird(false);
            setForth(false);
            temp = { lat: markers[0].lat, lng: maxLngPt }
            firstAux.push(temp);
            temp = { lat: markers[0].lat, lng: minLngPt }
            firstAux.push(temp);
        }
        else if (markers.length == 2) {
            setFirst(true);
            setSecond(true);
            setThird(false);
            setForth(false);
            temp = { lat: markers[1].lat, lng: maxLngPt }
            firstAux.push(temp);
            temp = { lat: markers[1].lat, lng: minLngPt }
            firstAux.push(temp);
        }
        else if (markers.length == 3) {
            setFirst(true);
            setSecond(true);
            setThird(true);
            setForth(false);
            temp = { lat: maxLatPt, lng: markers[2].lng }
            firstAux.push(temp);
            temp = { lat: minLatPt, lng: markers[2].lng }
            firstAux.push(temp);
        }
        else {
            setFirst(true);
            setSecond(true);
            setThird(true);
            setForth(true);
            temp = { lat: maxLatPt, lng: markers[3].lng }
            firstAux.push(temp);
            temp = { lat: minLatPt, lng: markers[3].lng }
            firstAux.push(temp);
        }
    }, [markers])

    function deleteMarkers() {
        setMarkers([]);
        setAllLats([]);
        setAllLngs([]);
    }

    function optionHandler(e) {
        setOption(e.target.value);
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
                        sx={{ Height: "200px" }}
                        onClick={(event) => {
                            if (option == "limits" && markers.length < 4) {
                                setMarkers(current => [
                                    ...current,
                                    {
                                        lat: event.latLng.lat(),
                                        lng: event.latLng.lng()
                                    },
                                ]);
                                allLats.push(event.latLng.lat())
                                allLngs.push(event.latLng.lng())
                            }
                        }}
                    >
                        {option == "limits" && markers.map(marker => (
                            <Marker
                                position={{ lat: marker.lat, lng: marker.lng }}
                            />
                        ))}
                        {firstAux.length > 0 &&
                            <Polyline
                                path={firstAux}
                            />
                        }

                    </GoogleMap>
                </LoadScript>
                <Button color="error" onClick={deleteMarkers} >Eliminar pontos</Button>
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
                            <FormControlLabel value="local" control={<Radio color="success" />} label="Localização" />
                            <FormControlLabel value="limits" control={<Radio color="success" />} label="Limites" />
                        </RadioGroup>
                    </FormControl>

                    {option == "limits" ?
                        <Box>
                            <Typography color={first ? "darkgreen" : "error"}>1. Clique no mapa para definir o limite máximo de latitude</Typography>
                            <Typography color={second ? "darkgreen" : "error"}>2. Clique no mapa para definir o limite mínimo de latitude</Typography>
                            <Typography color={third ? "darkgreen" : "error"}>3. Clique no mapa para definir o limite máximo de longitude</Typography>
                            <Typography color={forth ? "darkgreen" : "error"}>4. Clique no mapa para definir o limite mínimo de longitude</Typography>
                        </Box>
                        :
                        <Box>
                            <Typography>Selecione uma localização</Typography>
                        </Box>
                    }
                    <Button color="success" size="large"> <Typography variant="h6" size="large"> Done </Typography> </Button>
                </Box>
            </Grid>
        </>
    )
}