import fotoDias from "../images/fotoDias.PNG";
import fotoGui from "../images/fotoGui.PNG";
import fotoRafa from "../images/fotoRafa.PNG";
import fotoAlex from "../images/fotoAlex.jpeg";
import fotoKiara from "../images/fotoKiara.jpg";
import instaLogo from "../images/insta.png";


import { Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";

export default function AboutUs() {
    return (
        <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch">
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="500"
                        image={fotoDias}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            João "Aguero" Dias
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Frontend
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Porta-voz destas nozes
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="500"
                        image={fotoRafa}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Rafael "Big Z" Borralho
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Frontend
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="500"
                        image={fotoAlex}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Alexandre "Alex" Godinho
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Backend
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="500"
                        image={fotoGui}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Guilherme "KOB" Pereira
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Android/Backend
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                        component="img"
                        height="500"
                        image={fotoKiara}
                        alt="green iguana"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Kiara "Kappa" Ventura
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Android
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <CardMedia sx={{position: "absolute", top: "84%", left: "80%", overflow: "auto"}}>
                <Typography mb={1} variant="h6">
                    Segue-nos nas redes sociais aqui!
                </Typography>
                <a href="https://www.instagram.com/landit.pt/" target="_blank">
                    <img src={instaLogo} margin-top="10px" height="60px" width="60px" />
                </a>
            </CardMedia>
        </Grid>

    )
}