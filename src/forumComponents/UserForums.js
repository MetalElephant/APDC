import { Button, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";

export default function UserForums() {

    const [loaded, setLoaded] = react.useState(false)

    var forums = JSON.parse(localStorage.getItem('forumsUser'))

    useEffect(() => {
        restCalls.listUserForums().then(() => { setLoaded(true) })
    })


    function generateForums() {
        const forumCards = []
        if (forums == null || forums.length === 0)
            return <Typography> O utilizador não possui fórums criados.</Typography>
        else
            for (var i = 0; i < forums.length; i++) {
                forumCards.push(
                    <>
                        <Box sx={{ p: 1, width: "80%" }}>
                            <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p:1 }}>
                                <CardContent >
                                    <Typography gutterBottom align="left" variant="h5" component="div" sx={{ fontSize: 21 }}>
                                        {forums[i].name} ({forums[i].owner})
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        - {forums[i].topic}
                                    </Typography>
                                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt:2 }}>
                                        <Button variant="outlined" color="success" size="small">Aceder</Button>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                )
            }
        return forumCards;
    }

    return (
        <Grid container direction="column" justifyContent="flex-start" alignItems="center">
            {loaded && generateForums()}
        </Grid>
    )
}