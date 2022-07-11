import fotoDias from "../images/fotoDias.PNG";
import fotoGui from "../images/fotoGui.PNG";
import fotoRafa from "../images/fotoRafa.PNG";
import fotoAlex from "../images/fotoAlex.jpeg";
import fotoKiara from "../images/fotoKiara.jpg";
import instaLogo from "../images/insta.png";
import facebookLogo from "../images/facebook.png";


import { Grid, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { Box } from "@mui/system";

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
            <Box sx={{ position: "absolute", top: "85%", mr: "4%" }}>
                <a href="https://www.instagram.com/landit.pt/" target="_blank">
                    <img src={instaLogo} margin-top="10px" height="60px" width="60px" />
                </a>
            </Box>
            <Box sx={{ position: "absolute", top: "85%", ml: "4%" }}>
                <a href="https://www.facebook.com/Land-It-100985179358578" target="_blank">
                    <img src={facebookLogo} margin-top="10px" height="60px" width="60px" />
                </a>
            </Box>
        </Grid>
    )
}