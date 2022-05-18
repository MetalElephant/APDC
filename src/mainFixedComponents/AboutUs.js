import fotoDias from "../images/fotoDias.PNG";
import fotoGui from "../images/fotoGui.PNG";
import fotoRafa from "../images/fotoRafa.PNG";

import { Grid, Typography, Card, CardActions, CardContent, CardMedia, Button } from "@mui/material";

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
                            - Porta-voz da apresentação da Fase Alfa
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Este gajo é bom</Button>
                        <Button size="small">Foda-se que flop</Button>
                    </CardActions>
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
                    <CardActions>
                        <Button size="small">Este gajo é bom</Button>
                        <Button size="small">Foda-se que flop</Button>
                    </CardActions>
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
                            Alexandre "Alex" Godinho
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Backend
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Este gajo é bom</Button>
                        <Button size="small">Foda-se que flop</Button>
                    </CardActions>
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
                    <CardActions>
                        <Button size="small">Este gajo é bom</Button>
                        <Button size="small">Foda-se que flop</Button>
                    </CardActions>
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
                            Kiara "Kappa" Ventura
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Responsável pela parte de Android
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Este gajo é bom</Button>
                        <Button size="small">Foda-se que flop</Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>

    )
}