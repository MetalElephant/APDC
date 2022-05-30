import { Button, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, TextField } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";

export default function MessagesList() {

    const [loaded, setLoaded] = react.useState(false)

    const [message, setMessage] = react.useState("");

    var messages = JSON.parse(localStorage.getItem('messages'))

    function messageHandler(e) {
        setMessage(e.target.value);
    }

    function postMessageManager() {
        restCalls.postMessage(message).then(() => {window.location.reload()})
    }

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
                                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
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
        <>
            <Grid item xs={8} container direction="column" justifyContent="flex-start" alignItems="center">
                {loaded && generateMessages()}
            </Grid>
            <Grid item xs={2}>
                <TextField
                    sx={{ width: "90%", pt: 1 }}
                    color="success"
                    variant="outlined"
                    placeholder="Escreva aqui a sua mensagem..."
                    multiline
                    rows={5} 
                    onChange={messageHandler}
                />
                <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    sx={{ mt: 2, mb: 2, width: "90%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={(e) => { postMessageManager(e) }}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> post </Typography>
                </Button>
            </Grid>
        </>
    )
}