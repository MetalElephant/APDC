import react from "react"
import {Button, Grid,Typography, Drawer, Toolbar, Divider, List, ListItem } from '@mui/material';

const drawerWidth = 240;

export default function TabsUserParcelsRewards() {

    return (
        <Drawer variant="permanent" anchor="left"
                sx={{'& .MuiDrawer-paper': {width: drawerWidth, top: 165, boxSizing: 'border-box'}}}>
            <List>
                
                <Button
                    type="submit"
                    id="3"
                    fullWidth
                    variant="outlined"
                    color="success"
                    sx={{ mt: 2, width: "75%", height: "40px", bgcolor: "rgb(50,190,50)" }}
                    /*onClick={() => {setDisplay(2)}}*/
                >
                    <Typography sx={{ fontFamily: 'Verdana', fontSize: 14, color: "black" }}> modify attributes </Typography>
                </Button>
                <Divider />
                <ListItem button >
                    Modify User Attributes
                </ListItem>
                <Divider />
            </List>
            
        </Drawer>
    )
}