import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert, CircularProgress } from "@mui/material";

export default function COMAddReward() {

    const [name, setName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [price, setPrice] = react.useState("");

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isRewardCreated, setIsRewardCreated] = react.useState(false);
    const [isRewardNotCreated, setIsRewardNotCreated] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false);
    const [ShowPriceErr, setShowPriceErr] = react.useState(false);

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
        if (price < 1000) {
            setShowPriceErr(true)
        } else {
            setShowPriceErr(false)
            setShowProgress(true)
            restCalls.createReward(name, description, price)
                .then(() => { setIsRewardCreated(true); setDisplayMessage(0); setShowProgress(false) })
                .catch(() => { setIsRewardNotCreated(true); setDisplayMessage(1); setShowProgress(false) })
        }
    }

    return (
        <>
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
                            {ShowPriceErr && <Typography color="error"> O preço tem de ser igual ou superior a 1000 pontos </Typography>}
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
            <Grid item xs={2.5}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                sx={{ mt: "2%" }}
            >
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }} />}

                {isRewardCreated && (displayMessage === 0) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Recompensa criada com sucesso.</Typography>
                    </Alert> : <></>}
                {isRewardNotCreated && (displayMessage === 1) ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na criação de recompensa. Por favor, verifique os seus dados.</Typography>
                    </Alert> : <></>}
            </Grid>
        </>
    )
}