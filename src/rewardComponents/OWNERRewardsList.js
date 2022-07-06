import { Button, Grid, Typography, Box, Card, CardMedia, CardContent, CardActions, Divider, TextField } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";

export default function OWNERRewardsList() {

    const [loaded, setLoaded] = react.useState(false);

    var rewards = JSON.parse(localStorage.getItem('rewards'))

    useEffect(() => {
        restCalls.listUserRewards().then(() => { setLoaded(true) })
    })

    function redeemReward(owner, name) {
        restCalls.redeemReward(owner, name)
    }

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
                                    <Button onClick={() => { redeemReward(reward.owner, reward.name) }} variant="outlined" color="success" size="small">Claim Reward: {reward.price} pontos</Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </>
                )
            })
        return rewardCards;
    }

    return (
        <Grid item xs={8} container direction="column" justifyContent="flex-start" alignItems="center">
            {loaded && generateRewards()}
        </Grid>
    )
}

{/*<Box sx={{ p: 1, width: "80%" }}>
                            <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                                <CardContent >
                                    <Typography gutterBottom align="left" variant="h5" component="div" sx={{ fontSize: 21 }}>
                                        {rewards[i].name} ({rewards[i].owner})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        - {forums[i].topic}
                                    </Typography>
                                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
                                        <Button variant="outlined" color="success" size="small">Aceder</Button>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        </Box>
*/}