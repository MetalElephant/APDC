import { Button, Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import react, { useEffect } from "react";
import { useHistory } from "react-router-dom"

export default function AdminCard(props) {

    const [number, setNumber] = react.useState(0)
    const [forumName, setForumName] = react.useState("")
    const [forumOwner, setForumOwner] = react.useState("")
    const [message, setMessage] = react.useState("")
    const [messageOwner, setMessageOwner] = react.useState("")
    const [crtTime, setCrtTime] = react.useState("")

    useEffect(() => {
        setNumber(props.number);
        setForumName(props.forumName);
        setForumOwner(props.forumOwner);
        setMessage(props.message);
        setMessageOwner(props.messageOwner);
        setCrtTime(props.crtTime)
    }, [])

    return (
        <Box sx={{ p: 1, width: "80%" }}>
            <Card variant="outlined" sx={{ maxWidth: 700, maxHeight: 300, p: 1 }}>
                <CardContent >
                    <Typography gutterBottom align="left" variant="h5" component="div" sx={{ fontSize: 21 }}>
                        {messageOwner}:
                    </Typography>
                    <Typography variant="body1" >
                        - {message}
                    </Typography>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
                        <Typography variant="h5" component="div" sx={{ fontSize: 14 }}> {crtTime}</Typography>
                    </CardActions>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-start", pt: 2 }}>
                        <Button onClick={() => props.handleDelete(message, messageOwner)} variant="outlined" color="error" size="small">Remover</Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Box>
    )
}