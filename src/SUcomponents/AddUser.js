import react, { useEffect } from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function ModifyAttributes() {

    const [username, setUsername] = react.useState("");
    const [role, setRole] = react.useState("");

    function usernameHandler(e) {
        setUsername(e.target.value)
    }

    function roleHandler(e) {
        setRole(e.target.value)
    }

    return (
        <>
            <Grid item xs={5}>
                <Container align="left" component="main" maxWidth="xs">
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
                            Adicionar Utilizador
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                autoFocus
                                value={username}
                                name="username"
                                label="Nome de utilizador"
                                id="username"
                                color="success"
                                onChange={usernameHandler}
                            />

                            <FormControl variant="standard">
                                <InputLabel id="id" sx={{ color: "green" }} >Papel</InputLabel>
                                <Select label="papel" value={role} onChange={roleHandler} sx={{ width: "250px" }}>
                                    <MenuItem value="Proprietário" label="Proprietário">
                                        Proprietário
                                    </MenuItem >
                                    <MenuItem value="Comerciante" label="Comerciante">
                                        Comerciante
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { /*modifyAttributesManager(e)*/ }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> criar utilizador </Typography>
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
                sx={{ mt: "55px" }}
            >
            </Grid>
        </>
    )
}