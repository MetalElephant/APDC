import react from 'react'
import restCalls from "../restCalls"
import {Box, Container, Typography, TextField, Button, Grid} from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';


export default function Profile() {
    const [markers, setMarkers] = react.useState([]);

    const [owner, setOwner] = react.useState("");
    const [parcelName, setParcelName] = react.useState("");
    const [parcelId, setParcelId] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [area, setArea] = react.useState("");

    function ownerHandler(e) {
        setOwner(e.target.value);
    }

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

    function parcelRegisterManager(e) {
        e.preventDefault();
        restCalls.parcelRegister(owner, parcelId, parcelName, description, groundType, currUsage, prevUsage, area);
    }
  
    return (
    <Grid container spacing={2} direction="column">
        <Grid item xs={12} container>
            <Grid item xs={8}> 
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    <GoogleMap
                        mapContainerStyle={{width: "100%", height: "100%"}}
                        center={{lat: 39.5532, lng: -7.99846}}
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
                            console.log(markers)
                        }}
                    >
                        {markers.map(marker => (
                            <Marker 
                                key={marker.time.toISOString()} 
                                position={{ lat: marker.lat, lng: marker.lng}} 
                            />

                        ))}

                        <Polygon
                            paths={markers}
                            onClick={() => this.handleClick()}
                            options={{ strokeOpacity: 0.8, strokeColor: "#000000", fillColor:"#191970"}}
                        />

                        { /* Child components, such as markers, info windows, etc. */ }
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
                                id="owner"
                                label="Proprietario"
                                name="owner"
                                autoFocus
                                onChange = {ownerHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="freguesiaSeccaoArtigo"
                                label="Freguesia, Secção e Artigo"
                                name="freguesiaSeccaoArtigo"
                                onChange = {parcelIdHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="nome"
                                label="Nome"
                                id="nome"
                                onChange = {parcelNameHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="descricao"
                                label="Descrição"
                                id="descricao"
                                onChange = {descriptionHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="tipoCoberturaSolo"
                                label="Tipo de Cobertura do Solo"
                                id="tipoCoberturaSolo"
                                onChange = {groundTypeHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAtual"
                                label="Utilização Atual"
                                id="utilizacaoAtual"
                                onChange = {currUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAnterior"
                                label="Utilização Anterior"
                                id="utilizacaoAnterior"
                                onChange = {prevUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="area"
                                label="Área (aproximada)"
                                id="area"
                                onChange = {areaHandler}
                            />

                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, height:"40px" }}
                                onClick={(e) => { parcelRegisterManager(e) }} 
                            >
                                submit
                            </Button>  
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    </Grid>
    )
}