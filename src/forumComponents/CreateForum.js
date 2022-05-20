import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert } from "@mui/material";

export default function CreateForum() {
    
    const [forumName, setForumName] = react.useState("");
    const [topic, setTopic] = react.useState("");

    function forumNameHandler(e) {
        setForumName(e.target.value);
    }

    function topicHandler(e) {
        setTopic(e.target.value);
    }

    function createForumManager(e) {
        e.preventDefault();
        restCalls.createForum(forumName, topic)
    }

    return (
        <>
            <Grid item xs={5}>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 3,
                            marginBottom: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Forum Creation
                        </Typography>
                        <Box component="form" sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                autoFocus
                                name="forumName"
                                label="Name"
                                id="forumName"
                                //type={showOldPassword ? "text" : "password"}
                                //value={oldPassword}
                                color="success"
                                onChange={forumNameHandler}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="topic"
                                label="Topic"
                                name="topic"
                                //type={showNewPassword ? "text" : "password"}
                                //value={newPassword}
                                color="success"
                                onChange={topicHandler}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                color="success"
                                sx={{ mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                                onClick={(e) => { createForumManager(e) }}
                            >
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> create </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </>
    )
}