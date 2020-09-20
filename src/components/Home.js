import {
    Card, CardHeader, CardContent, Grid, IconButton, Divider, LinearProgress,
    List, ListItem, ListItemText
} from '@material-ui/core';
import React, { Component, useEffect, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ArrowForwardSharp, FlareSharp } from '@material-ui/icons';
import Skeleton from '@material-ui/lab/Skeleton';

import CanvasComponent from '../components/canvas'

import testimge from '../static/img/testcase1.jpg'

import { createWorker, RecognizeResult } from 'tesseract.js';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        minHeight: '50vh',
        maxWidth: '100%',
        padding: theme.spacing(2),

    },
    rootskeleton: {
        flexGrow: 1,

    },

    headline: {
        display: 'flex',
        minHeight: '50vh',
        maxWidth: '100%',
        padding: theme.spacing(2),
        backgroundColor: '#2e2e38'
    },
    pipeline: {
        display: 'flex',
        minHeight: '100vh',
        maxWidth: '100%',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
    },
    cardroot: {
        maxWidth: 400,
        height: 250
    },

    cardrootprocessing: {
        backgroundColor: 'whitesmoke'
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },


}));



function HomeComponent() {
    const classes = useStyles();

    const [selectedFile, setselectedFile] = useState(null);
    const [image, setImage] = useState(null);
    const [isUploadComplete, setIsUploadComplete] = useState(false);
    const [canvasRef, setCanvasRef] = useState(useRef(null));
    const [canvasContainer, setCanvasContainer] = useState(useRef(null));
    const [context, setContext] = useState(null);
    var [ratio, setRatio] = useState(null);

    const [progress, setProgress] = useState(0.0);
    const [status, setStatus] = useState('Ready...');

    const [result, setResult] = useState(null);
    const [lines, setLines] = useState([]);
    const [paragraphs, setParagraphs] = useState([]);

    const fileChangedHandler = (event) => {
        setselectedFile(event.target.files[0]);
    }

    const uploadHandler = async () => {
        console.log(selectedFile);

        setImage(selectedFile);

        setIsUploadComplete(true);

        setCanvasRef(canvasRef.current);
        const ctx = canvasRef.current.getContext('2d');

        setContext(ctx);

        const image = new Image();
        image.onload = () => drawImageScaled(ctx, image);
        image.src = URL.createObjectURL(selectedFile);

        setImage(image);

        var worker = createWorker({
            logger: m => {
                setProgress(m.progress * 100);
                setStatus(m.status);
            } //setState({ status: m.status, progress: m.progress * 100 }),
        });

        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        const { data } = await worker.recognize(selectedFile);
        var listOfBannedWords = ['CRM', 'sales lead', 'brown', 'solutions', 'solution'];
        var foundBannedWords = [];

        if (data) {
            setStatus('OCR Complete.')
            console.log(data);
            setResult(data);
            setLines(data.lines);
            setParagraphs(data.paragraphs);
        }

    }

    const handleListItemClick = (event, line) => {
        drawBBox(line.bbox);
    }

    // tslint:disable-next-line:no-any
    const drawImageScaled = (ctx, img) => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const hRatio = width / img.width;
        const vRatio = height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        if (ratio > 1) {
            ratio = 1;
        }
        ctx.canvas.width = img.width * ratio;
        ctx.canvas.height = img.height * ratio;

        ctx.clearRect(0, 0, img.width, img.width);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio);

        setRatio(ratio);
    }

    const redrawImage = () => {
        const ctx = canvasRef.current.getContext('2d');
        console.log(image);
        if (image) {

            drawImageScaled(ctx, image);
        }
    }

    const drawBBox = (bbox) => {
        if (bbox) {
            redrawImage();

            if (ratio === null) {
                throw new Error('ratio not set');
            }

            context.beginPath();
            context.moveTo(bbox.x0 * ratio, bbox.y0 * ratio);
            context.lineTo(bbox.x1 * ratio, bbox.y0 * ratio);
            context.lineTo(bbox.x1 * ratio, bbox.y1 * ratio);
            context.lineTo(bbox.x0 * ratio, bbox.y1 * ratio);
            context.closePath();
            context.strokeStyle = '#bada55';
            context.lineWidth = 2;
            context.stroke();
        }
    }


    return (
        <>
            <Grid container direction="column" alignItems='center' justify="center" className={classes.root}>
                <Grid item>
                    <Typography variant="h2" gutterBottom >ISAC MLR Solution</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1" gutterBottom >Upload documents, perform MLR Compliance and get results.</Typography>
                </Grid>
                <Grid item>
                    <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
                        <ArrowForwardSharp />
                    </IconButton>
                </Grid>
                {/* <Grid item>
                    <input type="file" name="file" onChange={fileChangedHandler} />
                    <button onClick={uploadHandler}>Upload!</button>
                    <canvas ref={canvasRef} width={500} height={500} />
                </Grid> */}



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

            <Grid
                container
                direction="row"

                className={classes.pipeline}
                spacing={3}
                style={{ padding: 2, }}
            >

                <Grid item alignItems='center' justify="center" >

                    <Card className={classes.cardrootprocessing}>
                        <CardHeader
                            title={'Upload Image'}
                            subheader={'Upload image to perfom MLR'}
                        >

                        </CardHeader>
                        <CardContent>
                            <input type="file" name="file" onChange={fileChangedHandler} />
                            <button onClick={uploadHandler}>Upload!</button>

                        </CardContent>
                        <CardContent>
                            <LinearProgress variant="determinate" value={progress} />
                            <h4>{status}</h4>
                        </CardContent>

                        <div ref={canvasContainer}>
                            <canvas ref={canvasRef} />
                        </div>

                    </Card>
                </Grid>


                {(result) ?
                    <Grid item>

                        <Card className={classes.cardrootprocessing}>
                            <CardHeader
                                title={'Processing Result'}

                            >
                            </CardHeader>
                            <CardContent className={classes.demo}>
                                <Typography variant="h6" className={classes.title}>  Paragraphs </Typography>

                                <List component="p" >
                                    {paragraphs.map((row) => (
                                        <ListItem
                                            button
                                            onClick={(event) => handleListItemClick(event, row)}
                                        >
                                            <ListItemText primary={row.text}
                                                secondary={row.confidence.toFixed(2) + '%'} />

                                        </ListItem>
                                    ))}
                                </List>

                            </CardContent>
                            <CardContent className={classes.demo}>
                                <Typography variant="h6" className={classes.title}>  Lines </Typography>

                                <List component="p" >
                                    {lines.map((row) => (
                                        <ListItem
                                            button
                                            onClick={(event) => handleListItemClick(event, row)}
                                        >
                                            <ListItemText primary={row.text}
                                                secondary={row.confidence.toFixed(2) + '%'} />

                                        </ListItem>
                                    ))}
                                </List>

                            </CardContent>
                        </Card>
                        <Card className={classes.cardrootprocessing}>


                        </Card>
                    </Grid>

                    :
                    <Grid item>
                        <Card className={classes.cardrootprocessing}>
                            <CardHeader
                                title={'Processing Result'}

                            >
                            </CardHeader>
                            <Skeleton animation="wave" variant="rect"  />
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" variant="rect" />
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" variant="rect"  />
                            <Skeleton animation="wave" variant="rect" />
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" variant="rect" />
                        </Card>


                    </Grid >




                }
            </Grid>

        </>
    );
}


export default HomeComponent;