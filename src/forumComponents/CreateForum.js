import react from 'react'
import restCalls from "../restCalls"
import { Box, Container, Typography, TextField, Button, Grid, Alert, CircularProgress } from "@mui/material";

export default function CreateForum() {

    const [forumName, setForumName] = react.useState("");
    const [topic, setTopic] = react.useState("");

    const [displayMessage, setDisplayMessage] = react.useState();
    const [isForumCreated, setIsForumCreated] = react.useState(false);
    const [isForumNotCreated, setIsForumNotCreated] = react.useState(false);
    const [showProgress, setShowProgress] = react.useState(false);

    function forumNameHandler(e) {
        setForumName(e.target.value);
    }

    function topicHandler(e) {
        setTopic(e.target.value);
    }

    function createForumManager(e) {
        e.preventDefault();
        setShowProgress(true)
        restCalls.createForum(forumName, topic)
            .then(() => { setIsForumCreated(true); setDisplayMessage(0); setShowProgress(false) })
            .catch(() => { setIsForumNotCreated(true); setDisplayMessage(1); setShowProgress(false) })
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
                            Criar Fórum
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
                                <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Criar </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Grid>
            <Grid item xs={2.5}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                sx={{ mt: "52px" }}
            >
                {showProgress && <CircularProgress size='3rem' color="success" sx={{ position: "absolute", top: "40%", left: "50%", overflow: "auto" }}/>}

                {isForumCreated && (displayMessage === 0) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Forum criado com sucesso.</Typography>
                    </Alert> : <></>}
                {isForumNotCreated && (displayMessage === 1) ?
                    <Alert severity="error" sx={{ width: '100%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na criação do forum. Por favor, verifique os seus dados.</Typography>
                    </Alert> : <></>}
            </Grid>
        </>
    )
}