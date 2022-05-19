import react, { useRef, useCallback } from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export default function RegisterParcel() {
    const [markers, setMarkers] = react.useState([]);
    const [allLats, setAllLats] = react.useState([]);
    const [allLngs, setAllLngs] = react.useState([]);
    const [parcelName, setParcelName] = react.useState("");
    const [parcelId, setParcelId] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [area, setArea] = react.useState("");
    const [isParcelSubmit, setIsParcelSubmit] = react.useState(false);
    const [isParcelNotSubmit, setIsParcelNotSubmit] = react.useState(false);
    const [displayParcelMessage, setDisplayParcelMessage] = react.useState(false);
    let index = 0;

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

    /*
    function updateMarkers(lat, lng, indexTemp) {
        console.log("index: " + indexTemp)
        console.log("latitude: " + lat)
        //console.log(lng)
        let temp = {
            lat: lat,
            lng: lng,
            time: new Date()
        }
        markers[indexTemp] = temp;
    }
    */

    function updateMarkers(event) {
        console.log("hello world")
    }


    /*
    const polygonRef = useRef(null);

    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map(latLng => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setMarkers(nextPath);
        }
    }, [setMarkers]);
    */

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
                        {markers.map(marker => (
                            <Marker
                                draggable={true}
                                key={index}
                                id={index}
                                onDrag={(e) => {
                                    var temp = {
                                        lat: e.latLng.lat(),
                                        lng: e.latLng.lng(),
                                        time: new Date()
                                    }
                                    markers[index-1] = temp
                                    allLats[index-1] = e.latLng.lat()
                                    allLngs[index-1] = e.latLng.lng()
                                }}
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
                                onClick={(e) => {parcelRegisterManager(e) }}
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