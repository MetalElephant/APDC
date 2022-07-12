import { Button, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, CircularProgress } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";
import ForumCard from "./ForumCard"
import MessagesList from "./MessagesList"

export default function ParcelForums() {

    const [loaded, setLoaded] = react.useState(false)
    const [showMessages, setShowMessages] = react.useState(false)
    const [removedForum, setRemovedForum] = react.useState(false)
    const [notRemovedForum, setNotRemovedForum] = react.useState(false)
    const [showAlert, setShowAlert] = react.useState(0)

    var forums = JSON.parse(localStorage.getItem('forumsParcel'))

    useEffect(() => {
        restCalls.listParcelForums().then(() => { setLoaded(true) })
    })

    function onClickFun(number) {
        localStorage.setItem('forum', JSON.stringify(forums[number]));
        setShowMessages(true)
    }

    function goBack() {
        setShowMessages(false)
    }

    function generateForums() {
        const forumCards = []

        if (forums == null || forums.length === 0)
            return <Typography> Não há forums criados.</Typography>
        else
            for (var i = 0; i < forums.length; i++) {
                forumCards.push(
                    <>
                        <Box sx={{ p: 1, width: "100%" }} >
                            <ForumCard
                                onClickFun={onClickFun}
                                number={i}
                                name={forums[i].name}
                                owner={forums[i].owner}
                                topic={forums[i].topic}
                            />
                        </Box>
                    </>
                )
            }
        return forumCards;
    }

    return (
        <Grid item xs={8} container>
            {!loaded && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "40%", left: "50%", overflow: "auto" }}/> }
            {(loaded && !showMessages) && generateForums()}
            {(loaded && showMessages) && <MessagesList onClickFun={goBack} />}
        </Grid>
    )
}