import { Button, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";

export default function MessagesList() {

    const [loaded, setLoaded] = react.useState(false)

    var messages = JSON.parse(localStorage.getItem('messages'))

    useEffect(() => {
        restCalls.listForumMessages().then(() => { setLoaded(true) })
    })

    function generateMessages() {
        const messageCards = []
        if (messages == null || messages.length === 0)
            return <Typography> Este fórum não possui mensagens.</Typography>
        else
            for (var i = 0; i < messages.length; i++) {
                messageCards.push(
                    <>
                        <Box sx={{ p: 1, width: "80%" }}>
                            <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                                <CardContent >
                                    <Typography gutterBottom align="left" variant="h5" component="div" sx={{ fontSize: 21 }}>
                                        {messages[i].owner}:
                                    </Typography>
                                    <Typography variant="body1" >
                                        - {messages[i].message}
                                    </Typography>
                                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt:2 }}>
                                        <Typography variant="h5" component="div" sx={{ fontSize: 14 }}> {messages[i].crtTime}</Typography>
                                    </CardActions>
                                </CardContent>
                            </Card>
                        </Box>
                    </>
                )
            }
        return messageCards;
    }

    return (
        <Grid container direction="column" justifyContent="flex-start" alignItems="center">
            {loaded && generateMessages()}
        </Grid>
    )
}