import { Button, Typography, Grid, TextField, Alert, CircularProgress } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminMessageCard from "../forumComponents/AdminMessageCard"

export default function MessagesList(props) {
    const [loaded, setLoaded] = react.useState(false)
    const [message, setMessage] = react.useState("");
    const [messageErr, setMessageErr] = react.useState({});
    const [isMessagePosted, setIsMessagePosted] = react.useState(false)
    const [isMessageNotPosted, setIsMessageNotPosted] = react.useState(false)
    const [displayMessage, setDisplayMessage] = react.useState(false)
    const [showProgress, setShowProgress] = react.useState(false)

    //ignorar a lista abaixo, serve única e exclusivamente para a moderação de mensagens
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
            setShowProgress(true)
            restCalls.postMessage(message)
                .then(() => { setLoaded(false); setIsMessagePosted(true); setIsMessageNotPosted(false); setShowProgress(false); setMessage(""); restCalls.listForumMessages().then(() => setLoaded(true)) })
                .catch(() => { setLoaded(true); setIsMessageNotPosted(true); setIsMessagePosted(false); setShowProgress(false) })
            setMessageErr({})
            setDisplayMessage(true)
        }
    }

    const handleDelete = (message, messageOwner) => {
        setShowProgress(true)
        restCalls.removeMessage(props.forumOwner, props.forumName, message, messageOwner)
            .then(() => { setLoaded(false); setShowProgress(false); restCalls.listForumMessages().then(() => setLoaded(true)) })
            .catch(() => { setLoaded(true); setShowProgress(false) })
    }

    const messageErrorValidation = () => {
        const messageErr = {};
        let isValid = true;
        let i = 0;

        while (isValid && i < forbiddenWords.length) {
            if (message.toLowerCase().match(forbiddenWords[i]) != null) {
                messageErr.wordsNotAllowed = "A mensagem que está a tentar enviar contém uma ou mais palavras que não são permitidas. Por favor verifique a sua mensagem."
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
                    <AdminMessageCard handleDelete={handleDelete} crtTime={messages[i].crtTime} messageOwner={messages[i].owner} message={messages[i].message} />
                )
            }
        return messageCards;
    }

    return (
        <Grid container>
            <Grid item xs={9} direction="column" justifyContent="flex-start" alignItems="center">
                <Button onClick={props.onClickFun} sx={{ position: "absolute", top: "20%", left: "18%", overflow: "auto" }}>
                    <ArrowBackIcon />
                </Button>
                {loaded && generateMessages()}
                {(!loaded || showProgress) && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "35%", left: "40%", overflow: "auto" }} />}
            </Grid>
            <Grid item xs={3} >
                <TextField
                    sx={{ width: "100%", pt: 1 }}
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
        </Grid>
    )
}