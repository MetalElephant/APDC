import { Button, Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import react, { useEffect } from "react";
import { useHistory } from "react-router-dom"

export default function ForumsCard(props) {

    let history = useHistory();

    const [number, setNumber] = react.useState(0)

    const [name, setName] = react.useState("")
    const [owner, setOwner] = react.useState("")
    const [topic, setTopic] = react.useState("")

    var forums = JSON.parse(localStorage.getItem('forumsAll'))

    useEffect(() => {
        setNumber(props.number);
        setName(props.name);
        setOwner(props.owner);
        setTopic(props.topic);
    })

    function forumDiscussion() {
        history.push("/main/forumDiscussion")
        localStorage.setItem('forum', JSON.stringify(forums[number]));
    }

    return (
        <Box sx={{ p: 1, width: "80%" }}>
            <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                <CardContent >
                    <Typography gutterBottom align="left" variant="h5" component="div" sx={{ fontSize: 21 }}>
                        {name} ({owner})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        - {topic}
                    </Typography>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
                        <Button onClick={() => { forumDiscussion() }} variant="outlined" color="success" size="small">Aceder</Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Box>
    )
}