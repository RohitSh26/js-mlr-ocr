import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '../static/img/EYLogo.png'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    toolbar: {
        minHeight: 25,
        alignItems: 'flex-start',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1),
        backgroundColor: '#2e2e38',
    },
    title: {
        flexGrow: 1,
        alignSelf: 'flex-end',
    },
}));

function HeaderComponent() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar variant="dense" className={classes.toolbar}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                    <img src={logo} className={classes.logo} />
                        ISAC MLR
    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default HeaderComponent