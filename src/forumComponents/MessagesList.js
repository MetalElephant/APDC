import { Button, Box, Typography, Grid, Card, CardContent, CardActions, TextField, Alert } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function MessagesList(props) {

    const [loaded, setLoaded] = react.useState(false)
    const [message, setMessage] = react.useState("");
    const [messageErr, setMessageErr] = react.useState({});
    const [isMessagePosted, setIsMessagePosted] = react.useState(false)
    const [isMessageNotPosted, setIsMessageNotPosted] = react.useState(false)
    const [displayMessage, setDisplayMessage] = react.useState(false)

    const forbiddenWords = ["puta", "caralho", "cona", "obesa", "obeso", "merda", "cabrão", "cabrao", "rabo", "pila",
        "porra", "foda", "fodido", "larapio", "rego", "peido"];

    var messages = JSON.parse(localStorage.getItem('messages'))

    useEffect(() => {
        restCalls.listForumMessages().then(() => { setLoaded(true) })
    }, [])

    function messageHandler(e) {
        setMessage(e.target.value);
    }

    function postMessageManager() {
        const isMessageValid = messageErrorValidation();
        if (isMessageValid) {
            restCalls.postMessage(message)
                .then(() => { setLoaded(false); setIsMessagePosted(true); setIsMessageNotPosted(false); setMessage(""); restCalls.listForumMessages().then(() => setLoaded(true)) })
                .catch(() => { setLoaded(true); setIsMessageNotPosted(true); setIsMessagePosted(false); })
            setMessageErr({})
            setDisplayMessage(true)
        }
    }

    const messageErrorValidation = () => {
        const messageErr = {};
        let isValid = true;
        let i = 0;

        while (isValid && i < forbiddenWords.length) {
            if (message.toLowerCase().match(forbiddenWords[i]) != null) {
                messageErr.wordsNotAllowed = "A mensagem que está a tentar enviar contém uma ou mais palavras não permitidas. Por favor, verifique o seu texto."
                isValid = false;
                setMessageErr(messageErr)
                setMessage("")
            }
            i++;
        }

        return isValid;
    }

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
            <Grid item xs={9} direction="column" justifyContent="flex-start" alignItems="center">
                <Button onClick={props.onClickFun} sx={{ position: "absolute", top: "20%", left: "18%", overflow: "auto" }}>
                    <ArrowBackIcon />
                </Button>
                {loaded && generateMessages()}
            </Grid>
            <Grid item xs={3} >
                <TextField
                    sx={{ width: "90%", pt: 1 }}
                    color="success"
                    variant="outlined"
                    placeholder="Escreva aqui a sua mensagem..."
                    multiline
                    value={message}
                    rows={5}
                    onChange={messageHandler}
                />
                {Object.keys(messageErr).map((key) => {
                    return <Typography sx={{ color: "red", fontSize: 14 }}> {messageErr[key]}</Typography>
                })}
                <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    sx={{ mt: 2, mb: 2, width: "90%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={postMessageManager}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Enviar Mensagem </Typography>
                </Button>

                {(isMessagePosted && displayMessage) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Mensagem enviada!</Typography>
                    </Alert> : <></>}
                {(isMessageNotPosted && displayMessage) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Erro ao enviar a mensagem.</Typography>
                    </Alert> : <></>
                }
            </Grid>
        </>
    )
}