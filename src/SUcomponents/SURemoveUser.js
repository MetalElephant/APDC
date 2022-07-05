import react from 'react'
import restCalls from "../restCalls"
import { Button, Grid, Typography, Container, Box, TextField, Alert } from "@mui/material";

export default function SURemoveUser() {

    const [userToBeRemoved, setUserToBeRemoved] = react.useState("");

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isUserRemoved, setIsUserRemoved] = react.useState(false);
    const [isUserNotRemoved, setIsUserNotRemoved] = react.useState(false);

    function userToBeRemovedHandler(e) {
        setUserToBeRemoved(e.target.value);
    }

    function userToBeRemovedManager(e) {
        e.preventDefault();
        restCalls.deleteUser(userToBeRemoved).then(() => { setIsUserRemoved(true); setDisplayMessage(0) }).catch(() => { setIsUserNotRemoved(true); setDisplayMessage(1) })
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
                            Remoção de Utilizador
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="utilizadorARemover"
                                label="Utilizador a remover"
                                id="utilizadorARemover"
                                color="success"
                                onChange={userToBeRemovedHandler}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { userToBeRemovedManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Remover Utilizador </Typography>
                            </Button>
                        </Box>
                    </Box>
                    {isUserRemoved && (displayMessage === 0) ?
                        <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Utilizador removido com sucesso.</Typography>
                        </Alert> : <></>}
                    {isUserNotRemoved && (displayMessage === 1) ?
                        <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                            <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na remoção do utilizador. Por favor, verifique o nome do mesmo.</Typography>
                        </Alert> : <></>}
                </Container>
            </Grid>
        </>
    )
}