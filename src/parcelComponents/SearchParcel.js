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
            <Grid item xs={10} sx={{ml:"100"}}>
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