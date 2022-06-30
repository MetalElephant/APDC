import { Button, Grid, Typography, Box, Card, CardMedia, CardContent, CardActions, Divider, TextField } from "@mui/material";

export default function RedeemRewards() {

    return (
        <Grid item xs={8} container direction="column" justifyContent="flex-start" alignItems="center">
            <Box sx={{ p: 2 }}>
                <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                    <CardContent>
                        <Typography gutterBottom align="left" variant="h5" component="div">
                            Reward Nº1
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Esta reward é demais. Mesmo muito boa. Ao reclamar a mesma, irá acumular 30 pontos. Não está bem a ver a sorte que tem. Bom demais. cvceeccece. ecece.c ecececw.cqs ca.c a.ca  reclamar a mesma, irá acumular 30 pontos. Não está bem a ver a sorte que tem. Bom demais. cvceeccece.
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="outlined" color="success" size="small">Claim Reward: 30 pontos</Button>
                    </CardActions>
                </Card>
            </Box>
            <Box sx={{ p: 2 }}>
                <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                    <CardContent>
                        <Typography gutterBottom align="left" variant="h5" component="div">
                            Reward Nº2
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Esta reward é demais. Mesmo muito boa. Ao reclamar a mesma, irá acumular 30 pontos. Não está bem a ver a sorte que tem. Bom demais. cvceeccece. ecece.c ecececw.cqs ca.c a.ca ito boa. Ao reclamar a mesma, irá acumular 30 pontos. Não está bem a ver a so
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="outlined" color="success" size="small">Claim Reward: 20 pontos</Button>
                    </CardActions>
                </Card>
            </Box>
            <Box sx={{ p: 2 }}>
                <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                    <CardContent>
                        <Typography gutterBottom align="left" variant="h5" component="div">
                            Reward Nº3
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Esta reward é demais. Mesmo muito boa. Ao reclamar a mesma, irá acumular 30 pontos. Não está bem a ver a sorte que tem. Bom demais. cvceeccece. ecece.c ecececw.cqs ca.c a.ca
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button disabled variant="outlined" color="success" size="small">Claim Reward: 25 pontos</Button>
                    </CardActions>
                </Card>
            </Box>
            <Box sx={{ p: 2 }}>
                <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                    <CardContent>
                        <Typography gutterBottom align="left" variant="h5" component="div">
                            Reward Nº3
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            - Esta reward é demais. Mesmo muito boa. Ao reclamar a mesma, irá acumular 30 pontos. Não está bem a ver a sorte que tem. Bom demais. cvceeccece. ecece.c ecececw.cqs ca.c a.ca
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="outlined" color="success" size="small">Claim Reward</Button>
                    </CardActions>
                </Card>
            </Box>
        </Grid>
    )
}