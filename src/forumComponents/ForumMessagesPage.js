import react, {useEffect} from "react"
import { Button, Grid, Typography } from "@mui/material";
import ListAltIcon from '@mui/icons-material/ListAlt';
import MessageIcon from '@mui/icons-material/Message';
import MessagesList from "./MessagesList";
import PostMessage from "./PostMessage";

export default function ForumMessagesPage(){

    const [display, setDisplay] = react.useState(0);

    return (
        <Grid item xs={12} container align="center">
        <Grid item xs={2}>
        <Button
                type="submit"
                id="3"
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<ListAltIcon sx={{ color: "black" }} />}
                sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                onClick={() => { setDisplay(0) }}
            >
                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> messages list </Typography>
            </Button>
            <Button
                type="submit"
                id="3"
                fullWidth
                variant="outlined"
                color="success"
                startIcon={<MessageIcon sx={{ color: "black" }} />}
                sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                onClick={() => { setDisplay(1) }}
            >
                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> post message </Typography>
            </Button>
        </Grid>
        {(display === 0) ? <MessagesList/> : <></>}
        {(display === 1) ? <PostMessage/> : <></>}
    </Grid>

    )
}