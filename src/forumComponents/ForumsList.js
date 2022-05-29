import { Button, Box, Typography, Grid, Card, CardMedia, CardContent, CardActions } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls";
import { useHistory } from "react-router-dom"
import ForumCard from "./ForumCard"

export default function ForumsList() {
    let history = useHistory();

    const [loaded, setLoaded] = react.useState(false)

    var forums = JSON.parse(localStorage.getItem('forumsAll'))

    useEffect(() => {
        restCalls.listAllForums().then(() => { setLoaded(true) })
    })

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
        <Grid container direction="column" justifyContent="flex-start" alignItems="center">
            {loaded && generateForums()}
        </Grid>
    )
}