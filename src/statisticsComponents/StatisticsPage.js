import { Grid, Card, Box, Typography } from "@mui/material";
import react, { useEffect } from "react";
import restCalls from "../restCalls"

export default function StatisticsPage() {

    const [nUsers, setNUsers] = react.useState("")
    const [nParcels, setNParcels] = react.useState("")
    const [nForums, setNForums] = react.useState("")
    const [nMessages, setNMessages] = react.useState("")
    const [avParcels, setAverageParcels] = react.useState("")
    const [avForums, setAverageForums] = react.useState("")
    const [avMessages, setAverageMessages] = react.useState("")
    const [uMostParcels, setUMostParcels] = react.useState("")
    const [uMostForums, setUMostForums] = react.useState("")
    const [uMostMessages, setUMostMessages] = react.useState("")

    useEffect(() => {
        var numberUsers = JSON.parse(localStorage.getItem('numberOfUsers'))
        setNUsers(numberUsers)

        var numberParcels = JSON.parse(localStorage.getItem('numberOfParcels'))
        setNParcels(numberParcels)

        var numberForums = JSON.parse(localStorage.getItem('numberOfForums'))
        setNForums(numberForums)

        var numberMessages = JSON.parse(localStorage.getItem('numberOfMessages'))
        setNMessages(numberMessages)

        restCalls.averageParcelStatistics();
        var averageParcels = JSON.parse(localStorage.getItem('averageParcels'))
        setAverageParcels(averageParcels)

        restCalls.averageForumStatistics();
        var averageForums = JSON.parse(localStorage.getItem('averageForums'))
        setAverageForums(averageForums)

        restCalls.averageMessageStatistics();
        var averageMessages = JSON.parse(localStorage.getItem('averageMessages'))
        setAverageMessages(averageMessages)

    }, [])

    useEffect(() => {
        restCalls.userMostParcelsStatistics();
        var userMostParcels = JSON.stringify(localStorage.getItem('userMostParcels'))
        setUMostParcels(userMostParcels)

        restCalls.userMostForumsStatistics();
        var userMostForums = JSON.stringify(localStorage.getItem('userMostForums'))
        setUMostForums(userMostForums)

        restCalls.userMostMessagesStatistics();
        var userMostMessages = JSON.stringify(localStorage.getItem('userMostMessages'))
        setUMostMessages(userMostMessages)
    })

    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            UTILIZADORES
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
                            Utilizador com maior número de parcelas registadas: {uMostParcels}
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Utilizador com maior número de forums registados: {uMostForums}
                        </Typography>
                    </Card>
                </Box>
                <Box sx={{ p: 1 }}>
                    <Card raised sx={{ p: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: 15 }}>
                            Utilizador com maior número de mensagens registadas: {uMostMessages}
                        </Typography>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            PARCELAS
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
                            Número médio de parcelas registadas por utilizador: {avParcels}
                        </Typography>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            FÓRUNS
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
                            Número médio de forums registados por utilizador: {avForums}
                        </Typography>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={3}>
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    <Card variant="outlined" sx={{ p: 2, width: "50%", bgcolor: "whitesmoke", color: "darkgreen" }}>
                        <Typography textAlign="center" variant="h5" sx={{ fontSize: 17 }}>
                            MENSAGENS
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
                            Número médio de mensagens registadas por utilizador: {avMessages}
                        </Typography>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    )
}