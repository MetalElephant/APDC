import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import landAvatar from "../images/land-avatar.png";
import { Box, Container, Typography, TextField, Button, Grid, Alert, Select, FormControl, InputLabel, Autocomplete, CircularProgress, MenuItem, ButtonGroup } from "@mui/material";
import { Data, GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import { Refresh } from '@mui/icons-material';

export default function ModifyParcel() {

    const [parcelName, setParcelName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [markers, setMarkers] = react.useState([]);
    const [markersMem, setMarkersMem] = react.useState([]);
    const [allLatsMem, setAllLatsMem] = react.useState([]);
    const [allLngsMem, setAllLngsMem] = react.useState([]);
    const [allLats, setAllLats] = react.useState([]);
    const [allLngs, setAllLngs] = react.useState([]);
    //const [owners, setOwners] = react.useState("");
    const [owner, setOwner] = react.useState("");
    const [chosenParcel, setChosenParcel] = react.useState("");

    const [loaded, setLoaded] = react.useState(false);
    const [loadButtons, setLoadButtons] = react.useState(false);
    const [displayMessage, setDisplayMessage] = react.useState(false);
    const [isModifySubmit, setIsModifySubmit] = react.useState(false);
    const [isModifyNotSubmit, setIsModifyNotSubmit] = react.useState(false);
    const [isNotDelete, setIsNotDelete] = react.useState(true);
    const [isDelete, setIsDelete] = react.useState(false);
    const [displayDeleteMessage, setDisplayDeleteMessage] = react.useState(false);
    const [markersErr, setMarkersErr] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false)
    const [allUsers, setAllUsers] = react.useState([])
    const [owners, setOwners] = react.useState([]);


    var parcels = JSON.parse(localStorage.getItem('parcels'))
    var users = JSON.parse(localStorage.getItem('allUsers'))

    useEffect(() => {
        restCalls.listAllProps().then(() => { users = JSON.parse(localStorage.getItem('allProps')); setAllUsers(users) })
        restCalls.parcelInfo().then(() => { setLoaded(true) })
    }, [])

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
                setMarkersMem(temp)
                setAllLatsMem(allLats)
                setAllLngsMem(allLngs)
                setOriginValues(parcels[chosenParcel]);
                setLoadButtons(true)
            }
        }
    }, [chosenParcel])

    function setOriginValues(parcel) {
        setOwner(parcel.owner)
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

    function deleteMarkers() {
        setMarkers([]);
        setAllLats([]);
        setAllLngs([]);
    }

    function resetMarkers() {
        setMarkers(markersMem);
        setAllLats(allLatsMem);
        setAllLngs(allLngsMem);
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

    function modifySuccess() {
        setIsModifySubmit(true);
        setIsModifyNotSubmit(false);
        setMarkersErr(false)
    }

    function modifyUnsuccess() {
        setIsModifySubmit(false)
        setIsModifyNotSubmit(true)
    }

    function deleteSuccess() {
        setIsNotDelete(false)
        setIsDelete(true)
        setDisplayMessage(false);
        setDisplayDeleteMessage(true);
    }

    function deleteUnsuccess() {
        setIsDelete(false)
        setIsNotDelete(true)
        setDisplayMessage(false);
        setDisplayDeleteMessage(true);
    }

    function modifyParcelManager(e) {
        e.preventDefault();
        if (markers.length >= 3) {
            setShowProgress(true)
            restCalls.modifyParcel(owner, owners, parcelName, description, groundType, currUsage, prevUsage, allLats, allLngs)
                .then(() => { modifySuccess(); setShowProgress(false) })
                .catch(() => { modifyUnsuccess(); setShowProgress(false) });
            setDisplayDeleteMessage(false);
            setDisplayMessage(true);
        }
        else {
            setMarkersErr(true)
            setIsModifySubmit(false)
        }
    }

    function deleteParcelManager(e) {
        e.preventDefault();
        setShowProgress(true)
        restCalls.deleteParcel(parcelName, owner)
            .then(() => { deleteSuccess(); setShowProgress(false) })
            .catch(() => { deleteUnsuccess(); setShowProgress(false) });
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
                    <InputLabel id="id">Parcelas</InputLabel>
                    <Select label="parcels" value={chosenParcel} onChange={setAttributes} sx={{ width: "150px" }}>
                        {loaded && generateSelects()}
                    </Select>
                </FormControl>

                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }} />}

                <Button color="error" onClick={deleteParcelManager} variant="contained" sx={{ mt: "20px" }}> Remover parcela </Button>

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

                {isDelete && displayDeleteMessage ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela eliminada com sucesso.</Typography>
                    </Alert> : <></>
                }
                {isNotDelete && displayDeleteMessage ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao eliminar a parcela. Por favor, verifique o nome da parcela.</Typography>
                    </Alert> : <></>
                }
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
                            Modificar Parcela
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <Autocomplete
                                multiple
                                id="tags-filled"
                                options={allUsers.map((user) => user.username)}
                                value={owners}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Outros Proprietários"
                                        placeholder="Outros Proprietários"
                                    />
                                )}
                                onChange={(event, newValue) => {
                                    setOwners(newValue)
                                }}
                            />
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
                                label="Utilização Prévia"
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
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modificar parcela </Typography>
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
                </LoadScript>
                {loadButtons &&
                    <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button color="error" onClick={deleteMarkers}>Delete Markers</Button>
                        <Button color="success" onClick={resetMarkers}>Reset Markers</Button>
                    </ButtonGroup>
                }
                {markersErr && <Typography color="error"> Escolha 3 ou mais pontos para definir uma parcela </Typography>}
            </Grid>
        </>
    )
}