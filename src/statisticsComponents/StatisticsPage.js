import { Grid, Card, Box, Typography } from "@mui/material";
import react, { useEffect } from "react";

export default function StatisticsPage() {

    const [nUsers, setNUsers] = react.useState("")
    const [nParcels, setNParcels] = react.useState("")
    const [nForums, setNForums] = react.useState("")
    const [nMessages, setNMessages] = react.useState("")

    

    useEffect(() =>  {
        var numberUsers = JSON.parse(localStorage.getItem('numberOfUsers'))
        setNUsers(numberUsers)
    
        var numberParcels = JSON.parse(localStorage.getItem('numberOfParcels'))
        setNParcels(numberParcels)

        var numberForums = JSON.parse(localStorage.getItem('numberOfForums'))
        setNForums(numberForums)

        var numberMessages = JSON.parse(localStorage.getItem('numberOfMessages'))
        setNMessages(numberMessages)
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            USERS
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número de utilizadores registados no sistema: {nUsers}
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Utilizador com maior número de parcelas registadas:
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Utilizador com maior número de forums registados:
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Utilizador com maior número de mensagens registadas:
                        </Typography>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            PARCELS
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }} >
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número de parcelas registadas no sistema: {nParcels}
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número médio de parcelas registadas por utilizador:
                        </Typography>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            FORUMS
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }} >
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número de forums registados no sistema: {nForums}
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número médio de forums registados por utilizador:
                        </Typography>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            MESSAGES
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número de mensagens registados no sistema: {nMessages}
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Número médio de mensagens registadas por utilizador:
                        </Typography>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    )
}