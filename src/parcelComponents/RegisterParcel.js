import react, { useRef, useCallback, useEffect } from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert, Autocomplete, listClasses } from "@mui/material";
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import locais from "../locais/distritos.txt"
import { useParams } from 'react-router-dom';

export default function RegisterParcel() {
    const [markers, setMarkers] = react.useState([]);
    const [allLats, setAllLats] = react.useState([]);
    const [allLngs, setAllLngs] = react.useState([]);
    const [parcelName, setParcelName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [isParcelSubmit, setIsParcelSubmit] = react.useState(false);
    const [isParcelNotSubmit, setIsParcelNotSubmit] = react.useState(false);
    const [displayParcelMessage, setDisplayParcelMessage] = react.useState(false);
    const [freg, setFreg] = react.useState([]);
    const [conc, setConc] = react.useState([]);
    const [dist, setDist] = react.useState([]);
    const [chosenFreg, setChosenFreg] = react.useState(null);
    const [chosenConc, setChosenConc] = react.useState(null);
    const [chosenDist, setChosenDist] = react.useState(null);
    const [owners, setOwners] = react.useState([]);
    const [image, setImage] = react.useState();
    const [preview, setPreview] = react.useState();
    const fileInputRef = react.useRef();
    const [imageArray, setImageArray] = react.useState();
    const [distConcState, setDistConcState] = react.useState();
    const [concFregState, setConcFregState] = react.useState();
    const [disableConc, setDisableConc] = react.useState(true);
    const [disableFreg, setDisableFreg] = react.useState(true);
    const [type, setType] = react.useState(2);
    const [allUsers, setAllUsers] = react.useState([])

    let index = 0;
    let split = [];
    var users = JSON.parse(localStorage.getItem('allUsers'))

    useEffect(() => {
        restCalls.listAllProps().then(() => { users = JSON.parse(localStorage.getItem('allProps')); setAllUsers(users) })

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
                setDist(distritos)
                setConc(concelhos)
                setFreg(freguesias)
                setDistConcState(distToConc)
                setConcFregState(concToFreg)
            });
    }, [])

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            }
            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }
    }, [image]);

    function parcelNameHandler(e) {
        setParcelName(e.target.value);
    }

    function descriptionHandler(e) {
        setDescription(e.target.value);
    }

    function ownersHandler(e) {
        setOwners(e.target.value);
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

    function getLastLat() {
        if (markers.length === 0) return 39.5532;
        return markers[0].lat;
    }

    function getLastLng() {
        if (markers.length === 0) return -7.99846;
        return markers[0].lng;
    }

    function loadPhoto(f) {
        const reader = new FileReader();
        const fileByteArray = [];

        reader.readAsArrayBuffer(f);
        reader.onloadend = (evt) => {
            if (evt.target.readyState === FileReader.DONE) {
                const arrayBuffer = evt.target.result,
                    array = new Uint8Array(arrayBuffer);
                for (const a of array) {
                    fileByteArray.push(a);
                }
                setImageArray(fileByteArray)
            }
        }
    }

    function resetValues() {
        setAllLats([]);
        setAllLngs([]);
        setMarkers([]);
        setParcelName("");
        setDescription("");
        setGroundType("");
        setCurrUsage("");
        setPrevUsage("");
        setChosenConc(null);
        setChosenFreg(null);
        setChosenDist(null);
        setOwners([]);
    }

    function resetValuesFail() {
        setAllLats([]);
        setAllLngs([]);
        setMarkers([]);
    }

    function parcelRegisterManager(e) {
        e.preventDefault();
        var tempOwners = []
        if(owners.length > 0) {
            owners.map((owner) => {
                tempOwners.push(owner.username)
            })
        }
        console.log(tempOwners)
        restCalls.parcelRegister(parcelName, tempOwners, chosenDist, chosenConc, chosenFreg,
            description, groundType, currUsage, prevUsage, allLats, allLngs, imageArray, 2)
            .then(() => { setIsParcelSubmit(true); setIsParcelNotSubmit(false); resetValues() }).catch(() => { setIsParcelSubmit(false); setIsParcelNotSubmit(true); });
        setDisplayParcelMessage(true);
    }

    return (
        <>
            <Grid item xs={6}>
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "70%" }}
                        center={{ lat: getLastLat(), lng: getLastLng() }}
                        zoom={12}
                        onClick={(event) => {
                            setMarkers(current => [
                                ...current,
                                {
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                    id: index++
                                },
                            ]);
                            allLats.push(event.latLng.lat())
                            allLngs.push(event.latLng.lng())
                        }}
                    >

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
                <Button color="error" onClick={resetValuesFail}>remover marcadores</Button>
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
                            Registo de parcela
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="nome"
                                label="Nome da parcela"
                                id="nome"
                                color="success"
                                value={parcelName}
                                onChange={parcelNameHandler}
                            />
                            <Autocomplete
                                multiple
                                id="tags-standard"
                                options={allUsers}
                                value={owners}
                                getOptionLabel={(option) => option.username}
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
                                    /*
                                    setOwners([
                                        ...owners,
                                        ...newValue.filter((option) => owners.indexOf(option.username) === -1),
                                    ]);*/
                                }}
                            />
                            <Autocomplete
                                selectOnFocus
                                id="distritos"
                                options={dist}
                                getOptionLabel={option => option}
                                value={chosenDist}
                                onChange={(_event, newDistrict) => {
                                    setChosenDist(newDistrict);
                                    setChosenConc(null)
                                    setChosenFreg(null)
                                    if (dist.length > 0) {
                                        if (distConcState.has(newDistrict)) {
                                            var temp = distConcState.get(newDistrict)
                                            setConc(temp)
                                            setDisableConc(false)
                                        }
                                    }
                                }}
                                sx={{ width: 400, mt: 1 }}
                                renderInput={(params) => <TextField {...params} label="Distrito *" />}
                            />
                            <Autocomplete
                                disabled={disableConc}
                                selectOnFocus
                                id="concelhos"
                                options={conc}
                                getOptionLabel={option => option}
                                value={chosenConc}
                                onChange={(_event, newConc) => {
                                    setChosenConc(newConc);
                                    setChosenFreg(null)
                                    if (dist.length > 0) {
                                        if (concFregState.has(newConc)) {
                                            var temp = concFregState.get(newConc)
                                            setFreg(temp)
                                            setDisableFreg(false)
                                        }
                                    }
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Concelho *" />}
                            />
                            <Autocomplete
                                disabled={disableFreg}
                                selectOnFocus
                                id="freguesias"
                                options={freg}
                                getOptionLabel={option => option}
                                value={chosenFreg}
                                onChange={(_event, newFreg) => {
                                    setChosenFreg(newFreg);
                                }}
                                sx={{ width: 400, mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Freguesia *" />}
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

                            <div>
                                <form>
                                    {preview ? (
                                        <img
                                            src={preview}
                                            style={{ objectFit: "cover", width: "200px", height: "200px", borderRadius: "70%", cursor: "pointer" }}
                                            onClick={() => {
                                                setImage(null);
                                            }}
                                        />
                                    ) : (
                                        <button
                                            style={{ width: "200px", height: "200px", borderRadius: "70%", cursor: "pointer" }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                fileInputRef.current.click();
                                            }}
                                        >
                                            Foto do documento
                                        </button>
                                    )}
                                    <input
                                        type="file"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            const f = e.target.files[0];
                                            if (f && f.type.substring(0, 5) === "image") {
                                                setType(2)
                                                setImage(f);
                                            }
                                            if (f.type.substring(0, 5) !== "image")
                                                setType(1)
                                            loadPhoto(f);
                                        }}
                                    />

                                </form>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 1.5, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { parcelRegisterManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Submeter </Typography>
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