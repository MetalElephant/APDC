import { Box, Typography, Grid, Paper, List, ListItem, ListItemText} from "@mui/material";

export default function ParcelInfo () {
    return(
        <>
            <Grid item xs={1.5} />
            <Grid item xs={5} sx={{ bgcolor: "#F5F5F5" }}>
                <Box p={5}>
                    <Paper>
                        <Box p={5}>
                            Boas
                        </Box>
                        <Box p={5}>
                            Boas
                        </Box>
                        <Box p={5}>
                            <Typography> Boas </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
        </>
    )
}