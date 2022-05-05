import react from 'react'
import restCalls from "../restCalls"

import { Box, Container, Typography, TextField, Button, Grid } from "@mui/material";

export default function modifyParcel() {

    const [parcelId, setParcelId] = react.useState("");
    const [parcelName, setParcelName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");
    const [area, setArea] = react.useState("");

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

    function modifyParcelManager(e) {
        e.preventDefault();
        restCalls.modifyParcel(parcelId, parcelName, description, groundType, currUsage, prevUsage, area);
    }

    return (
        <>
            <Grid item xs={2} />
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
                            Parcel Modification
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                id="freguesiaSeccaoArtigo"
                                label="Freguesia, Secção e Artigo"
                                name="freguesiaSeccaoArtigo"
                                onChange={parcelIdHandler}
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
                                onChange={descriptionHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="tipoCoberturaSolo"
                                label="Tipo de Cobertura do Solo"
                                id="tipoCoberturaSolo"
                                onChange={groundTypeHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAtual"
                                label="Utilização Atual"
                                id="utilizacaoAtual"
                                onChange={currUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAnterior"
                                label="Utilização Anterior"
                                id="utilizacaoAnterior"
                                onChange={prevUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="area"
                                label="Área (aproximada)"
                                id="area"
                                onChange={areaHandler}
                            />


                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, height: "40px" }}
                                onClick={(e) => { modifyParcelManager(e) }} 
                            >
                                submit
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </>
    )
}