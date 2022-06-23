import react, { useEffect } from 'react';
import restCalls from "../restCalls";
import { Box, Grid, FormControl, Radio, FormControlLabel, FormLabel, RadioGroup, Typography, Button } from "@mui/material";
import { Data, GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export default function SearchParcel() {

    const [chosenParcel, setChosenParcel] = react.useState("");
    const [latMax, setLatMax] = react.useState(0);
    const [latMin, setLatMin] = react.useState(0);
    const [lngMax, setLngMax] = react.useState(0);
    const [lngMin, setLngMin] = react.useState(0);
    const [markers, setMarkers] = react.useState([]);
    const [loaded, setLoaded] = react.useState(false);
    const [option, setOption] = react.useState("local");


    //var parcels = JSON.parse(restCalls.getParcelsByPosition(latMax, latMin, lngMax, lngMin))

    useEffect(() => {
        //setMarkers(parcels)
        //setLoaded(true)
    }, [])

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
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{ lat: 39.639538, lng: -8.088107 }}
                        zoom={7}
                    >
                        {loaded && markers.map(marker => (
                            <Marker
                                position={{ lat: marker.lat, lng: marker.lng }}
                            />
                        ))}

                        <Polygon
                            paths={markers}
                            onClick={() => this.handleClick()}
                            options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor: "#191970" }}
                        />
                    </GoogleMap>
                </LoadScript>
            </Grid>
            <Grid item xs={3}>
                <Box>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label"><Typography color="black" fontSize={20}>Pesquisa de parcelas por: </Typography></FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
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
                            <Typography>1. Clique no mapa para definir o limite máximo de latitude</Typography>
                            <Typography>2. Clique no mapa para definir o limite mínimo de latitude</Typography>
                            <Typography>3. Clique no mapa para definir o limite máximo de longitude</Typography>
                            <Typography>4. Clique no mapa para definir o limite mínimo de longitude</Typography>
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