import { Button, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, CircularProgress } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";
import { useHistory } from "react-router-dom"
import AdminMessages from "../forumComponents/AdminMessages";
import LogoutIcon from '@mui/icons-material/Logout';
import FeedIcon from '@mui/icons-material/Feed';
import AdminCard from "../forumComponents/AdminCard"

export default function ForumsList() {
    let history = useHistory();

    const [loaded, setLoaded] = react.useState(false)
    const [showMessages, setShowMessages] = react.useState(false)
    const [showProgress, setShowProgress] = react.useState(false)
    const [forumName, setForumName] = react.useState("")
    const [forumOwner, setForumOwner] = react.useState("")

    var forums = JSON.parse(localStorage.getItem('forumsAll'))

    useEffect(() => {
        restCalls.listAllForums().then(() => { setLoaded(true) })
    })

    function onClickFun(number, forumName, forumOwner) {
        localStorage.setItem('forum', JSON.stringify(forums[number]));
        setForumName(forumName)
        setForumOwner(forumOwner)
        setShowMessages(true)
    }

    function goBack() {
        setShowMessages(false)
    }

    function logoutManager() {
        setShowProgress(true)
        restCalls.logout().then(() => { history.push("/"); setShowProgress(false) })
    }

    function removeForum(owner, name) {
        setShowProgress(true)
        restCalls.removeForum(owner, name)
            .then(() => { setLoaded(false); setShowProgress(false); restCalls.listAllForums().then(() => { setLoaded(true) }) })
            .catch(() => { setShowProgress(false) })
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
                            <AdminCard
                                onClickFun={onClickFun}
                                onClickRem={removeForum}
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
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    <Button
                        disabled
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<FeedIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Gerir Fóruns </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="5"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<LogoutIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { logoutManager() }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> logout </Typography>
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    {!loaded && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "40%", left: "50%", overflow: "auto" }} />}
                    {(loaded && !showMessages) && generateForums()}
                    {(loaded && showMessages) && <AdminMessages onClickFun={goBack} forumName={forumName} forumOwner={forumOwner} />}
                    {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "50%", left: "50%", overflow: "auto" }} />}
                </Grid>
            </Grid>
        </Grid>
    )
}