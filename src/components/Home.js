import { Card, CardHeader, CardContent, Grid, IconButton, Divider } from '@material-ui/core';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ArrowForwardSharp, FlareSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        minHeight: '50vh',
        maxWidth: '100%',
        padding: theme.spacing(2),

    },

    headline: {
        display: 'flex',
        minHeight: '50vh',
        maxWidth: '100%',
        padding: theme.spacing(2),
        backgroundColor: '#2e2e38'
    },
    cardroot: {
        maxWidth: 400,
        height: 250
    },


}));

function HomeComponent() {
    const classes = useStyles();

    return (
        <>
            <Grid container direction="column" alignItems='center' justify="center" className={classes.root}>
                <Grid item>
                    <Typography variant="h2" gutterBottom >ISAC MLR Solution</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" gutterBottom >Upload documents, perform MLR Compliance and get results.</Typography>
                </Grid>
                <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
                    <ArrowForwardSharp />
                </IconButton>



            </Grid>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                className={classes.headline}
                spacing={3}
                style={{}}
            >
                <Grid item >

                    <Card className={classes.cardroot}>
                        <CardHeader
                            title={'Computer Vision'}
                            subheader={'Optical character recognotion'}
                        >

                        </CardHeader>

                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Computer vision performs optical character recongnition over each documents.
                                Paragraphs and Lines are extracted from the documents that are inputs to NLP Models.
        </Typography>
                        </CardContent>
                    </Card>


                </Grid>

                <Grid item >
                    <Card className={classes.cardroot}>
                        <CardHeader
                            title={'Natural Language Processing'}
                            subheader={'NLP pipeline over extracted text'}
                        >

                        </CardHeader>

                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                NLP is performed on each paragraphs and lines to understand text. This helps in identifying MLR compliance results.
        </Typography>
                        </CardContent>
                    </Card>

                </Grid>

                <Grid item >
                    <Card className={classes.cardroot}>
                        <CardHeader
                            title={'Analytics'}
                            subheader={'Display analytics for MLR'}
                        >

                        </CardHeader>

                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Analytics Dashboard to display insights. A power bi anaalytics is displayed for each processed documents along with overall results.
        </Typography>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>
        </>
    );
}


export default HomeComponent;