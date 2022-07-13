import { Button, Grid, Typography, Box, Card, CardContent, CardActions} from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";

export default function OWNERRedeemedRewards() {

    const [loaded, setLoaded] = react.useState(false);
    const [points, setPoints] = react.useState();

    var rewards = JSON.parse(localStorage.getItem('redeemedRewards'))
    var user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        restCalls.listUserRedeemedRewards().then(() => { setLoaded(true) })
        setPoints(user.points)
    }, [])

    function generateRewards() {
        const rewardCards = []
        if (rewards == null || rewards.length === 0)
            return <Typography> O utilizador não possui recompensas por reinvidicar.</Typography>
        else
            rewards.map((reward) => {
                rewardCards.push(
                    <>
                        <Box sx={{ p: 2 }}>
                            <Card variant="outlined" sx={{ width: 700, maxHeight: 300, p: 1 }}>
                                <CardContent>
                                    <Typography gutterBottom align="left" variant="h5" component="div">
                                        {reward.name} ({reward.owner})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontSize={15}>
                                        {reward.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button disabled variant="outlined" color="success" size="small">Claim Reward: {reward.timesRedeemed} pontos</Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </>
                )
            })
        return rewardCards;
    }

    return (
        <>
            <Grid item xs={6} container direction="column" justifyContent="flex-start" alignItems="center">
                {loaded && generateRewards()}
            </Grid>
            <Grid item xs={2} container direction="column" justifyContent="flex-start" alignItems="left">
                <Box display="flex" justifyContent="left" alignItems="left" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "100%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            Pontos: {points}
                        </Typography>
                    </Card>
                </Box>
            </Grid>
        </>
    )
}