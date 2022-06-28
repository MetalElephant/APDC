import react from "react"
import { Button, Grid, Typography } from "@mui/material";
import restCalls from "../restCalls"
import {useHistory} from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function SUUsers() {

    const [display, setDisplay] = react.useState(0);

    return (
        <Grid container spacing={2} direction="column">
            <Grid item xs={12} container align="center">
                <Grid item xs={2}>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<AccountBoxIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(0) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> lista de Utilizadores </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<PersonAddIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(1) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Adicionar Utilizador </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<PersonRemoveIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(2) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Remover Utilizador </Typography>
                    </Button>
                    <Button
                        type="submit"
                        id="1"
                        fullWidth
                        variant="outlined"
                        color="success"
                        startIcon={<ManageAccountsIcon sx={{ color: "black" }} />}
                        sx={{ mt: 2, width: "95%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                        onClick={() => { setDisplay(3) }}
                    >
                        <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> Modificar Utilizador </Typography>
                    </Button>
                </Grid>
                {(display === 0) ? <div> OLHEM</div> : <></>}
                {(display === 1) ? <div> OLHEM OLHEM</div> : <></>}
                {(display === 2) ? <div> FUCK IT</div> : <></>}
                {(display === 3) ? <div> EU TOU COM MEUS HOMENS</div> : <></>}
            </Grid>
        </Grid>
    )
}