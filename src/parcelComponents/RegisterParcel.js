import react, { useRef, useCallback, useEffect } from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert, Autocomplete } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import locais from "../locais/distritos.txt"

export default function RegisterParcel() {
    const [markers, setMarkers] = react.useState([]);
    const [allLats, setAllLats] = react.useState([]);
    const [allLngs, setAllLngs] = react.useState([]);
    const [parcelName, setParcelName] = react.useState("");
    const [parcelId, setParcelId] = react.useState("");
    //const [existingParcels2, setExistingParcels2] = react.useState([]);
    //const [currMarkers2, setCurrMarkers2] = react.useState([]);
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [area, setArea] = react.useState("");
    const [isParcelSubmit, setIsParcelSubmit] = react.useState(false);
    const [isParcelNotSubmit, setIsParcelNotSubmit] = react.useState(false);
    const [displayParcelMessage, setDisplayParcelMessage] = react.useState(false);
    const [freg, setFreg] = react.useState([]);
    const [conc, setConc] = react.useState([]);
    const [dist, setDist] = react.useState([]);

    let index = 0;
    let existingParcels = []

    var parcels = JSON.parse(localStorage.getItem('parcels'))

    useEffect(() => {
        restCalls.parcelInfo();

        if (parcels != null) {
            parcels.map(parcel => {
                existingParcels.push({
                    parcelName: parcel.parcelName,
                    markers: parcel.markers
                })
            })
        }

        let split = [];
        let distritos = [];
        let concelhos = [];
        let freguesias = [];
        fetch(locais)
            .then(r => r.text())
            .then(text => {
                split = text.split(";")

                for(let i=0; i<split.length; i++) {
                    if(i%3 == 0 && distritos.indexOf(split[i]) == -1) distritos.push(split[i]);
                    else if(i%3 == 1 && concelhos.indexOf(split[i]) == -1) concelhos.push(split[i]);
                    else if(freguesias.indexOf(split[i]) == -1) freguesias.push(split[i]);
                }
                setDist(distritos)
                setConc(concelhos)
                setFreg(freguesias)
            });
    }, [])

    function parcelIdHandler(e) {
        setParcelId(e.target.value);
    }

    function parcelNameHandler(e) {
        setParcelName(e.target.value);
    }

    function descriptionHandler(e) {
        setDescription(e.target.value);
    }

    function groundTypeHandler(e) {
        setGroundType(e.target.value);
    }

    function currUsageHandler(e) {
        setCurrUsage(e.target.value);
    }

    function prevUsageHandler(e) {
        setPrevUsage(e.target.value);
    }

    function areaHandler(e) {
        setArea(e.target.value);
    }

    function getLastLat() {
        if (markers.length === 0) return 39.5532;
        return markers[0].lat;
    }

    function getLastLng() {
        if (markers.length === 0) return -7.99846;
        return markers[0].lng;
    }

    function showParcels() {
        let polygons = []
        let currMarkers = []
        //console.log(existingParcels)
        //console.log(existingParcels[0])

        existingParcels.map(parcel => (
            console.log("hi"),
            currMarkers = parcel.markers,
            currMarkers.map(marker => (
                <Marker
                    key={marker.area}
                    id={marker.area}
                    position={{ lat: marker.lat, lng: marker.lng }}
                />
            )),
            polygons.push(
                < Polygon
                    path={currMarkers}
                    options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor: "#191970" }}
                />
            )
        ))
        return polygons
    }

    function resetValues() {
        setAllLats([]);
        setAllLngs([]);
        setMarkers([]);
        setParcelName("");
        setParcelId("");
        setDescription("");
        setGroundType("");
        setCurrUsage("");
        setPrevUsage("");
        setArea("");
    }

    function resetValuesFail() {
        setAllLats([]);
        setAllLngs([]);
        setMarkers([]);
    }

    function parcelRegisterManager(e) {
        e.preventDefault();
        restCalls.parcelRegister(parcelName, parcelId, description, groundType, currUsage, prevUsage, area, allLats, allLngs)
            .then(() => { setIsParcelSubmit(true); setIsParcelNotSubmit(false); resetValues() }).catch(() => { setIsParcelSubmit(false); setIsParcelNotSubmit(true); resetValuesFail(); });
        setDisplayParcelMessage(true);
    }

    return (
        <>
            <Grid item xs={6}>
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{ lat: getLastLat(), lng: getLastLng() }}
                        zoom={12}
                        onClick={(event) => {
                            setMarkers(current => [
                                ...current,
                                {
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                    time: new Date(),
                                },
                            ]);
                            allLats.push(event.latLng.lat())
                            allLngs.push(event.latLng.lng())
                        }}
                    >
                        {showParcels()}

                        {markers.map(marker => (
                            <Marker
                                key={index}
                                id={index}
                                value={index++}
                                position={{ lat: marker.lat, lng: marker.lng }}
                            />
                        ))}

                        <Polygon
                            path={markers}
                            options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor: "#191970" }}
                        />

                        { /* Child components, such as markers, info windows, etc. */}
                    </GoogleMap>
                </LoadScript>
                <Button color="error" onClick={resetValuesFail}>Delete Markers</Button>
            </Grid>
            <Grid item xs={4}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 3,
                            marginBottom: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Parcel Registration
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="nome"
                                label="Nome"
                                id="nome"
                                color="success"
                                value={parcelName}
                                onChange={parcelNameHandler}
                            />

                            <Autocomplete
                                selectOnFocus
                                id="distritos"
                                options={dist}
                                sx={{ width: 400, mt:1 }}
                                renderInput={(params) => <TextField {...params} label="Distrito" />}
                            />
                            <Autocomplete
                                selectOnFocus
                                id="concelhos"
                                options={conc}
                                sx={{ width: 400, mt:2  }}
                                renderInput={(params) => <TextField {...params} label="Concelho" />}
                            />
                            <Autocomplete
                                selectOnFocus
                                id="freguesias"
                                options={freg}
                                sx={{ width: 400, mt:2  }}
                                renderInput={(params) => <TextField {...params} label="Freguesia" />}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="freguesiaSeccaoArtigo"
                                label="Freguesia, Secção e Artigo"
                                name="freguesiaSeccaoArtigo"
                                color="success"
                                value={parcelId}
                                onChange={parcelIdHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="descricao"
                                label="Descrição"
                                id="descricao"
                                color="success"
                                value={description}
                                onChange={descriptionHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="tipoCoberturaSolo"
                                label="Tipo de Cobertura do Solo"
                                id="tipoCoberturaSolo"
                                color="success"
                                value={groundType}
                                onChange={groundTypeHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAtual"
                                label="Utilização Atual"
                                id="utilizacaoAtual"
                                color="success"
                                value={currUsage}
                                onChange={currUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAnterior"
                                label="Utilização Anterior"
                                id="utilizacaoAnterior"
                                color="success"
                                value={prevUsage}
                                onChange={prevUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="area"
                                label="Área (aproximada)"
                                id="area"
                                color="success"
                                value={area}
                                onChange={areaHandler}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { parcelRegisterManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
                            </Button>
                            {(isParcelSubmit && displayParcelMessage) ?
                                <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Registo de parcela válido</Typography>
                                </Alert> : <></>
                            }
                            {(isParcelNotSubmit && displayParcelMessage) ?
                                <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Registo de parcela inválido. Por favor, verifique se tem pontos selecionados ou se já tem uma parcela com o nome: {parcelName}</Typography>
                                </Alert> : <></>
                            }
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </>
    )
}