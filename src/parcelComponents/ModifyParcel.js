import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import landAvatar from "../images/land-avatar.png";
import { Box, Container, Typography, TextField, Button, Grid, Alert, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { Data, GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

export default function ModifyParcel() {

    const [parcelName, setParcelName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [markers, setMarkers] = react.useState([]);
    const [allLats, setAllLats] = react.useState([]);
    const [allLngs, setAllLngs] = react.useState([]);
    const [owners, setOwners] = react.useState("");
    const [chosenParcel, setChosenParcel] = react.useState("");

    const [loaded, setLoaded] = react.useState(true);
    const [displayMessage, setDisplayMessage] = react.useState(false);
    const [isModifySubmit, setIsModifySubmit] = react.useState(false);
    const [isModifyNotSubmit, setIsModifyNotSubmit] = react.useState(false);


    var parcels = JSON.parse(localStorage.getItem('parcels'))

    useEffect(() => {
        const temp = []
        if (parcels != null) {
            if (parcels[chosenParcel] != null) {
                parcels[chosenParcel].markers.map(marker => {
                    temp.push({
                        lat: marker.latitude,
                        lng: marker.longitude,
                        time: new Date()
                    })
                    allLats.push(marker.latitude)
                    allLngs.push(marker.longitude)
                })
                setMarkers(temp)
                setOriginValues(parcels[chosenParcel]);
            }
        }
    }, [chosenParcel])

    function setOriginValues(parcel) {
        setOwners(parcel.owners)
        setDescription(parcel.description)
        setGroundType(parcel.groundType)
        setCurrUsage(parcel.currUsage)
        setPrevUsage(parcel.prevUsage)
    }

    function setAttributes(event) {
        var parcel = parcels[event.target.value]
        setChosenParcel(event.target.value)
        setParcelName(parcel.parcelName)
    }

    function resetMarkers() {
        setMarkers([]);
        setAllLats([]);
        setAllLngs([]);
    }


    function generateSelects() {
        const views = []
        if (parcels == null || parcels.length === 0)
            return <Typography> Não há parcelas registadas</Typography>
        else
            for (var i = 0; i < parcels.length; i++) {
                views.push(
                    <MenuItem
                        key={i}
                        value={i}
                    >
                        {parcels[i].parcelName}
                    </MenuItem>
                )
            }
        return views;
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

    function modifyParcelManager(e) {
        e.preventDefault();
        restCalls.modifyParcel(owners, parcelName, description, groundType, currUsage, prevUsage, allLats, allLngs)
            .then(() => { setIsModifySubmit(true); setIsModifyNotSubmit(false) }).catch(() => { setIsModifySubmit(false); setIsModifyNotSubmit(true) });
        setDisplayMessage(true);
    }

    return (
        <>
            <Grid item xs={2}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                sx={{ mt: "15px" }}
            >

                <FormControl variant="standard">
                    <InputLabel id="id">Parcels</InputLabel>
                    <Select label="parcels" value={chosenParcel} onChange={setAttributes} sx={{ width: "150px" }}>
                        {loaded && generateSelects()}
                    </Select>
                </FormControl>

                {isModifySubmit && displayMessage ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela modificada com sucesso.</Typography>
                    </Alert> : <></>
                }
                {isModifyNotSubmit && displayMessage ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao modificar a parcela. Por favor, verifique o nome da parcela.</Typography>
                    </Alert> : <></>
                }

                <Button color="error" variant="contained" sx={{ mt: "10px" }}> Eliminate parcel </Button>
            </Grid>
            <Grid item xs={3.5}>
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
                            Parcel Modification
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                name="descricao"
                                label="Descrição"
                                value={description}
                                id="descricao"
                                color="success"
                                onChange={descriptionHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="tipoCoberturaSolo"
                                label="Tipo de Cobertura do Solo"
                                value={groundType}
                                id="tipoCoberturaSolo"
                                color="success"
                                onChange={groundTypeHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="utilizacaoAtual"
                                label="Utilização Atual"
                                value={currUsage}
                                id="utilizacaoAtual"
                                color="success"
                                onChange={currUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="utilizacaoAnterior"
                                label="Utilização Anterior"
                                value={prevUsage}
                                id="utilizacaoAnterior"
                                color="success"
                                onChange={prevUsageHandler}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { modifyParcelManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
            <Grid item xs={4.5}>
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    {(parcels != null && parcels[chosenParcel] != null) &&
                        <GoogleMap
                            mapContainerStyle={{ width: "100%", height: "100%" }}
                            center={{ lat: parcels[chosenParcel].markers[0].latitude, lng: parcels[chosenParcel].markers[0].longitude }}
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
                    <Button color="error" onClick={resetMarkers}>Delete Markers</Button>
                </LoadScript>
            </Grid>
        </>
    )
}