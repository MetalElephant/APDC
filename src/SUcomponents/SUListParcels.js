import { Box, Typography, Grid, Paper, Autocomplete, TextField, Button, Alert } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";

export default function ListParcels() {

    const [chosenParcel, setChosenParcel] = react.useState()
    const [parcelName, setParcelName] = react.useState("")
    const [owner, setOwner] = react.useState("")
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
        restCalls.listParcels()
        var parcels = JSON.parse(localStorage.getItem('allParcels'))
        var temp = []
        if (parcels != null) {
            parcels.map((parcel) => {
                temp.push(parcel)
            })
            setAllParcels(temp)
        } else {
            setRepeat(!repeat)
        }
    }, [repeat])


    useEffect(() => {
        setParcelName(parcel.parcelName)
        setOwner(parcel.owner)
        setDist(parcel.district)
        setConc(parcel.county)
        setFreg(parcel.freguesia)
        setDescription(parcel.description)
        setGroundType(parcel.groundType)
        setCurrUsage(parcel.currUsage)
        setPrevUsage(parcel.prevUsage)
        setArea(parcel.area)
    }, [parcel])

    
    function parcelRemoval() {
        if (chosenParcel != null) {
            restCalls.deleteParcel(owner, chosenParcel).then(() => { setIsParcelRemoved(true); setIsParcelNotRemoved(false); setDisplayMessage(true) }).catch(() => { setIsParcelRemoved(false); setIsParcelNotRemoved(true); setDisplayMessage(true) })
        } else {
            setIsParcelRemoved(false);
            setIsParcelNotRemoved(true);
            setDisplayMessage(true)
        }
    }

    return (
        <>
            <Grid item xs={1.5} >
                <Autocomplete
                    selectOnFocus
                    id="parcels"
                    options={allParcels != null ? allParcels : []}
                    getOptionLabel={option => option.parcelName}
                    onChange={(event, newChosenParcel) => {
                        setChosenParcel(newChosenParcel.parcelName);
                        setParcel(newChosenParcel)
                    }}
                    sx={{ width: 200, mt: 1 }}
                    renderInput={(params) => <TextField {...params} label="Parcelas" />}
                />

                <Button onClick={parcelRemoval} variant="contained" size="large" color="error" sx={{ mt: 2 }}>Remover Parcela</Button>

                {(isParcelRemoved && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela removido com sucesso.</Typography>
                    </Alert> : <></>}
                {(isParcelNotRemoved && displayMessage) ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção da parcela. Por favor, verifique o nome do mesmo.</Typography>
                    </Alert> : <></>}
            </Grid>
            <Grid item xs={4.5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={1.5} sx={{ fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18 }}> Dono da Parcela: {owner} </Typography>
                    </Paper>
                </Box>
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