import react from 'react'
import restCalls from "../restCalls"
import landAvatar from "../images/land-avatar.png";
import { Box, Container, Typography, TextField, Button, Grid, Alert} from "@mui/material";

export default function modifyParcel() {

    const [parcelName, setParcelName] = react.useState("");
    const [description, setDescription] = react.useState("");
    const [groundType, setGroundType] = react.useState("");
    const [currUsage, setCurrUsage] = react.useState("");
    const [prevUsage, setPrevUsage] = react.useState("");

    const [displayMessage, setDisplayMessage] = react.useState(false);
    const [isModifySubmit, setIsModifySubmit] = react.useState(true);

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
        restCalls.modifyParcel(parcelName, description, groundType, currUsage, prevUsage)
        .then(() => {setIsModifySubmit(true)}).catch(() => {setIsModifySubmit(false)});
        setDisplayMessage(true);
    }

    return (
        <>
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
                            Parcel Modification
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="nome"
                                label="Nome da parcela que deseja alterar"
                                id="nome"
                                color="success"
                                onChange = {parcelNameHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="descricao"
                                label="Descrição"
                                id="descricao"
                                color="success"
                                onChange={descriptionHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="tipoCoberturaSolo"
                                label="Tipo de Cobertura do Solo"
                                id="tipoCoberturaSolo"
                                color="success"
                                onChange={groundTypeHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="utilizacaoAtual"
                                label="Utilização Atual"
                                id="utilizacaoAtual"
                                color="success"
                                onChange={currUsageHandler}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                name="utilizacaoAnterior"
                                label="Utilização Anterior"
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
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> submit </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
            <Grid item xs={2} 
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    sx = {{mt:"55px"}}
            >
                {isModifySubmit && displayMessage ? 
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Parcela modificada com sucesso.</Typography>
                    </Alert> : <></>
                }
                {!isModifySubmit && displayMessage ? 
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha ao modificar a parcela. Por favor, verifique o nome da parcela.</Typography>
                    </Alert> : <></>
                }
            </Grid>
            <Grid item xs={4} 
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
            >       
                <Box component="img" src = {landAvatar} sx={{height: "300px", width: "400px"}}   />
            </Grid>
        </>
    )
}