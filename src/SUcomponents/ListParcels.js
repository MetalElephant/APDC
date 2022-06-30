import { Box, Typography, Grid, Paper, Autocomplete, TextField, Button, Alert } from "@mui/material";
import mapsAvatar from "../images/maps-avatar.png";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";
import { color } from "@mui/system";

export default function ListParcels() {

    const [chosenParcel, setChosenParcel] = react.useState()
    const [parcelName, setParcelName] = react.useState("")
    const [dist, setDist] = react.useState("")
    const [conc, setConc] = react.useState("")
    const [freg, setFreg] = react.useState("")
    const [description, setDescription] = react.useState("")
    const [groundType, setGroundType] = react.useState("")
    const [currUsage, setCurrUsage] = react.useState("")
    const [prevUsage, setPrevUsage] = react.useState("")
    const [area, setArea] = react.useState("")
    const [allParcels, setAllParcels] = react.useState([])
    const [parcel, setParcel] = react.useState([])
    const [repeat, setRepeat] = react.useState(false)
    const [isParcelRemoved, setIsParcelRemoved] = react.useState(false)
    const [isParcelNotRemoved, setIsParcelNotRemoved] = react.useState(true)
    const [displayMessage, setDisplayMessage] = react.useState(false)

    useEffect(() => {
        restCalls.listUsers()
        var parcels = JSON.parse(localStorage.getItem('allParcels'))
        var temp = []
        if (parcels != null) {
            parcels.map((user) => {
                temp.push(user)
            })
            setAllParcels(temp)
        } else {
            setRepeat(!repeat)
        }
    }, [repeat])

/*
    useEffect(() => {
        setUsername(user.username)
        setRole(user.role)
        setName(user.name)
        setEmail(user.email)
        setVisibility(user.visibility)
        setHomePhone(user.landphone)
        setMobilePhone(user.mobilephone)
        setAddress(user.address)
        setNif(user.nif)
    }, [user])*/

    function userToBeRemovedManager() {
        if(chosenParcel != null) {
            restCalls.deleteParcel(chosenParcel).then(() => { setIsParcelRemoved(true); setIsParcelNotRemoved(false); setDisplayMessage(true) }).catch(() => { setIsParcelRemoved(false); setIsParcelNotRemoved(true); setDisplayMessage(true) })
        }else {
            setIsParcelRemoved(false); 
            setIsParcelNotRemoved(true);
            setDisplayMessage(true)
        }
    }

    return (
        <>
            <Grid item xs={2} >
                <Autocomplete
                    selectOnFocus
                    id="parcels"
                    options={allParcels != null ? allParcels : []}
                    getOptionLabel={option => option.parcelName}
                    onChange={(event, newChosenParcel) => {
                        setChosenParcel(newChosenParcel.parcelName);
                        setParcel(newChosenParcel)
                    }}
                    sx={{ width: "80%", mt: 2 }}
                    renderInput={(params) => <TextField {...params} label="Parcelas" />}
                />

                <Button onClick={userToBeRemovedManager} variant="contained" size="large" color="error" sx={{ width: "80%", mt: 2 }}>Remover Utilizador</Button>

                {(isParcelRemoved && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador removido com sucesso.</Typography>
                    </Alert> : <></>}
                {(isParcelNotRemoved && displayMessage) ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção do utilizador. Por favor, verifique o nome do mesmo.</Typography>
                    </Alert> : <></>}
            </Grid>
            <Grid item xs={4} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Nome da Parcela: {parcelName} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Distrito: {dist} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Concelho: {conc} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Freguesia: {freg} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Descrição: {description} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Tipo de Cobertura de Solo: {groundType} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Utilização Atual: {currUsage} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Utilização Prévia: {prevUsage} </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontSize: 18 }}> Área: {area} </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={4}>
            </Grid>
        </>
    )
}