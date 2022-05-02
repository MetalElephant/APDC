import React from 'react'
import {Box, Container, Typography, TextField, Button, Grid} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


function Profile() {
  const [markers, setMarkers] = React.useState([]);

  return (
    <Grid container spacing={2} direction="column">
        <Grid item xs={12} container>
            <Grid item xs={8}> 
                <LoadScript
                    googleMapsApiKey="AIzaSyAyGEjLRK5TFI9UvrLir2sFIvh5_d8VXEs"
                >
                    <GoogleMap
                        mapContainerStyle={{width: "100%", height: "100%"}}
                        center={{lat: 39.5532, lng: -7.99846}}
                        zoom={12}
                        onClick={(event) => {
                            setMarkers(current => [
                                ...current, 
                                {
                                    lat: event.latLng.lat(),
                                    lng: event.latLng.lng(),
                                    time: new Date(),
                                },
                            ]);
                        }}
                    >
                        {markers.map(marker => (
                            <Marker 
                                key={marker.time.toISOString()} 
                                position={{ lat: marker.lat, lng: marker.lng}} 
                            />
                        ))}
                        { /* Child components, such as markers, info windows, etc. */ }
                    </GoogleMap>
                </LoadScript>
            </Grid>
            <Grid item xs={4}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 4,
                            marginBottom: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Parcel Registration
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="freguesiaSeccaoArtigo"
                                label="Freguesia, Secção e Artigo"
                                name="freguesiaSeccaoArtigo"
                                autoFocus
                                
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="nome"
                                label="Nome"
                                id="nome"
                                
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="descricao"
                                label="Descrição"
                                id="descricao"
                                
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="tipoCoberturaSolo"
                                label="Tipo de Cobertura do Solo"
                                id="tipoCoberturaSolo"
                                
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAtual"
                                label="Utilização Atual"
                                id="utilizacaoAtual"
                                
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="utilizacaoAnterior"
                                label="Utilização Anterior"
                                id="utilizacaoAnterior"
                                
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="area"
                                label="Área (aproximada)"
                                id="area"
                                
                            />

                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, height:"40px" }}
                                                                >
                                submit
                            </Button>  
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </Grid>
    </Grid>
  )
}

export default React.memo(Profile)