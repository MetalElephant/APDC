import react from 'react'
import restCalls from "../restCalls"
import { Button, Grid, Typography, Container, Box, TextField, Alert } from "@mui/material";

export default function MODRemoveParcel() {

    const [parcelToBeRemoved, setParcelToBeRemoved] = react.useState("");
    const [parcelOwner, setParcelOwner] = react.useState(false);

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isParcelRemoved, setIsParcelRemoved] = react.useState(false);
    const [isParcelNotRemoved, setIsParcelNotRemoved] = react.useState(false);

    function parcelToBeRemovedHandler(e) {
        setParcelToBeRemoved(e.target.value);
    }

    function parcelOwnerHandler(e) {
        setParcelOwner(e.target.value);
    }

    function parcelToBeRemovedManager(e) {
        e.preventDefault();
        restCalls.deleteParcel(parcelToBeRemoved, parcelOwner).then(() => { setIsParcelRemoved(true); setDisplayMessage(0) }).catch(() => { setIsParcelNotRemoved(true); setDisplayMessage(1) })
    }

    return (
        <>
            <Grid item xs={5} />
            <Grid item xs={2.5}>
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
                            Remoção de Parcela
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="utilizadorARemover"
                                label="Parcela a remover"
                                id="utilizadorARemover"
                                color="success"
                                onChange={parcelToBeRemovedHandler}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="donoDaParcela"
                                label="Dono da parcela"
                                id="donoDaParcela"
                                color="success"
                                onChange={parcelOwnerHandler}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { parcelToBeRemovedManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Remover Parcela </Typography>
                            </Button>
                        </Box>
                    </Box>
                    {isParcelRemoved && (displayMessage === 0) ?
                        <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela removida com sucesso.</Typography>
                        </Alert> : <></>}
                    {isParcelNotRemoved && (displayMessage === 1) ?
                        <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção de parcela. Por favor, verifique os seus dados.</Typography>
                        </Alert> : <></>}
                </Container>
            </Grid>
        </>
    )
}