import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert } from "@mui/material";

export default function COMAddReward() {

    const [name, setName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [price, setPrice] = react.useState("");

    function nameHandler(e) {
        setName(e.target.value);
    }

    function descriptionHandler(e) {
        setDescription(e.target.value);
    }

    function priceHandler(e) {
        setPrice(e.target.value);
    }

    function createRewardManager(e) {
        e.preventDefault();
        restCalls.createReward(name, description, price);
    }


    return (
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
                        Adicionar Recompensa
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            autoFocus
                            name="nomeRecompensa"
                            label="Nome da Recompensa"
                            id="nomeRecompensa"
                            color="success"
                            onChange={nameHandler}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="descricaoRecompensa"
                            label="Descrição"
                            name="descricaoRecompensa"
                            color="success"
                            onChange={descriptionHandler}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="preçoRecompensa"
                            label="Preço"
                            id="preçoRecompensa"
                            color="success"
                            onChange={priceHandler}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            color="success"
                            sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                            onClick={(e) => { createRewardManager(e) }}
                        >
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Adicionar Recompensa </Typography>
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Grid>
    )
}