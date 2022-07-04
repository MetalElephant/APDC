import { Box, Typography, Grid, Paper, Autocomplete, TextField, Button, Alert, Radio, FormControl, FormControlLabel, RadioGroup, FormLabel } from "@mui/material";
import react from 'react';
import { useEffect } from "react";
import restCalls from "../restCalls";

export default function ManageRewards() {

    const [chosenReward, setChosenReward] = react.useState()
    const [name, setName] = react.useState("")
    const [description, setDescription] = react.useState("")
    const [owner, setOwner] = react.useState("")
    const [value, setValue] = react.useState()
    const [allRewards, setAllRewards] = react.useState([])
    const [reward, setReward] = react.useState([])
    const [loaded, setLoaded] = react.useState(false)
    const [isModifyReward, setIsModifyReward] = react.useState(false)
    const [isNotModifyReward, setIsNotModifyReward] = react.useState(false)
    const [displayMessageModify, setDisplayMessageModify] = react.useState(false)
    const [isDeleteReward, setIsDeleteReward] = react.useState(false)
    const [isNotDeleteReward, setIsNotDeleteReward] = react.useState(false)
    const [displayMessageDelete, setDisplayMessageDelete] = react.useState(false)

    var rewards = JSON.parse(localStorage.getItem('rewards'))

    useEffect(() => {
        restCalls.listRewards().then(() => { setLoaded(true); rewards = JSON.parse(localStorage.getItem('rewards')) })
    }, [])

    useEffect(() => {
        var temp = []
        if (rewards != null) {
            rewards.map((reward) => {
                temp.push(reward)
            })
            setAllRewards(temp)
        }
    }, [loaded])

    useEffect(() => {
        setName(reward.name)
        setDescription(reward.description)
        setValue(reward.price)
        setOwner(reward.owner)
    }, [reward])

    function modifyReward() {
        restCalls.modifyReward(name, description, owner, value)
            .then(() => { setIsModifyReward(true); restCalls.listRewards() })
            .catch(() => {setIsNotModifyReward(true)})
        setDisplayMessageModify(true)
        setDisplayMessageDelete(false)
    }   

    function deleteReward() {
        restCalls.deleteReward(name, owner)
            .then(() => { setIsDeleteReward(true); restCalls.listRewards() })
            .catch(() => {setIsNotDeleteReward(true)})
        setDisplayMessageDelete(true)
        setDisplayMessageModify(false)
    }

    return (
        <>
            <Grid item xs={2} >
                <Autocomplete
                    selectOnFocus
                    id="rewards"
                    options={allRewards != null ? allRewards : []}
                    getOptionLabel={option => option.name}
                    onChange={(event, newChosenReward) => {
                        setChosenReward(newChosenReward.name);
                        setReward(newChosenReward)
                    }}
                    sx={{ width: "80%", mt: 2 }}
                    renderInput={(params) => <TextField {...params} label="Recompensas" />}
                />

                <Button onClick={deleteReward} variant="contained" size="large" color="error" sx={{ mt: 2, width: "80%" }}>Remover Recompensa</Button>
            </Grid>
            <Grid item xs={4} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="name"
                        label="Nome"
                        value={name}
                        id="name"
                        color="success"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="owner"
                        label="Criador da Recompensa"
                        value={owner}
                        id="owner"
                        color="success"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="description"
                        label="Descrição"
                        value={description}
                        id="description"
                        color="success"
                        onChange={(event) => { setDescription(event.target.value) }}
                    />
                </Box>
                <Box p={0} pl={3} pr={3} textAlign="center">
                    <TextField
                        margin="normal"
                        fullWidth
                        name="value"
                        label="Valor"
                        value={value}
                        id="value"
                        color="success"
                        onChange={(event) => { setValue(event.target.value) }}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    sx={{ width: "92%", mt: 3, mb: 2, height: "40px", bgcolor: "rgb(50,190,50)" }}
                    onClick={modifyReward}
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar Recompensa </Typography>
                </Button>
            </Grid>
            <Grid item xs={4}>
                {(isModifyReward && displayMessageModify) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Recompensa modificada com sucesso.</Typography>
                    </Alert> : <></>}
                {(isNotModifyReward && displayMessageModify) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na modificação da recompensa.</Typography>
                    </Alert> : <></>}

                {(isDeleteReward && displayMessageDelete) ?
                    <Alert severity="success" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Recompensa modificada com sucesso.</Typography>
                    </Alert> : <></>}
                {(isNotDeleteReward && displayMessageDelete) ?
                    <Alert severity="error" sx={{ width: '80%', mt: "25px" }}>
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14 }}>Falha na modificação da recompensa.</Typography>
                    </Alert> : <></>}
            </Grid>
        </>
    )
}