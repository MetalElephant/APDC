import { Button, Box, Typography, Card, CardContent, CardActions } from "@mui/material";
import react, { useEffect } from "react";
import { useHistory } from "react-router-dom"

export default function AdminCard(props) {
    const [number, setNumber] = react.useState(0)
    const [name, setName] = react.useState("")
    const [owner, setOwner] = react.useState("")
    const [topic, setTopic] = react.useState("")

    useEffect(() => {
        setNumber(props.number);
        setName(props.name);
        setOwner(props.owner);
        setTopic(props.topic);
    }, [])

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
                    <CardActions sx={{ display: "flex", justifyContent: "flex-start", pt: 2 }}>
                        <Button onClick={() => { props.onClickRem(owner, name) }} variant="outlined" color="error" size="small">Remover</Button>
                    </CardActions>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
                        <Button onClick={() => { props.onClickFun(props.number, props.name, props.owner) }} variant="outlined" color="success" size="small">Aceder</Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Box>
    )
}