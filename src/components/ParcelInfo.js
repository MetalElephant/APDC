import { Box, Typography, Grid, Paper} from "@mui/material";
import mapsAvatar from "../images/maps-avatar.png";
import landAvatar from "../images/land-avatar.png";

export default function ParcelInfo () {
    return(
        <>
            <Grid item xs={1.5} />
            <Grid item xs={5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={2.5} textAlign="center" >
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontWeight: 'bolder', fontSize: 18}}> AQUI </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontSize: 18}}> VAI </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontSize: 18}}>  APARECER </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontSize: 18}}>  A</Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontSize: 18}}> INFORMAÇÃO  </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontSize: 18}}> DA </Typography>
                    </Paper>
                </Box>
                <Box p={2.5} textAlign="center">
                    <Paper elevation={12}>
                        <Typography p={2} sx={{fontFamily: 'Verdana', fontSize: 18}}> PARCELA </Typography>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={3.5} 
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
            >       
                <Box  component="img" src = {mapsAvatar} sx={{height: "350px", width: "350px"}}   />
            </Grid>
        </>
    )
}