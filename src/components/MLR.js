import {
    Card, CardHeader, CardContent, Grid, Button, TextField, LinearProgress,
    List, ListItem, ListItemText, Divider,
    GridList, GridListTile

} from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardArrowRightSharp from '@material-ui/icons/KeyboardArrowRightSharp';

import React, { useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import Skeleton from '@material-ui/lab/Skeleton';


import { createWorker, RecognizeResult } from 'tesseract.js';

// import tensorflow
import * as tf from '@tensorflow/tfjs';
import * as qna from '@tensorflow-models/qna';

import Highlighter from "react-highlight-words";


const useStyles = makeStyles((theme) => ({
    pipeline: {
        display: 'flex',
        padding: theme.spacing(2),
    },
    cardroot: {
        maxWidth: 400,
        height: 250
    },

    cardrootprocessing: {
        backgroundColor: 'white',
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
    gridList: {
        width: '100%',
        height: 'auto',
    },
    paragraphroot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    qna: {
        minWidth: 400,
        width: 500,
    },
    inline: {
        display: 'inline',
    },
}));



function MLRComponent() {
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

    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState([]);

    const [bannedWords, setbannedWords] = useState([]);

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

    const handleUserQuestion = (event) => {
        console.log(event.target.value);
        setQuestion(event.target.value);
    }

    const handleQnA = async () => {
        // Load the model.
        const model = await qna.load();

        console.log(result.text);
        console.log(question);
        // Finding the answers
        const answers = await model.findAnswers(question, result.text);
        console.log(answers);
        setAnswers(answers);
    }



    return (
        <>
            {/* pipeline */}
            <Grid
                container
                direction="column"
                className={classes.pipeline}
                spacing={3}
            >
                {/* Upload */}
                <Grid item>

                    <Card className={classes.cardrootprocessing}>
                        <CardHeader
                            title={'Upload Image'}
                            subheader={'Upload image to perfom MLR'}
                        >

                        </CardHeader>


                        <CardContent>
                            <LinearProgress variant="determinate" value={progress} />
                            <h4>{status}</h4>

                            <input
                                accept="image/*"
                                className={classes.input}
                                id="contained-button-file"
                                onChange={fileChangedHandler}
                                type="file"
                                style={{ display: 'none' }}

                            />
                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    endIcon={<CloudUploadIcon />}

                                    style={{ margin: 10 }}
                                >
                                    Upload
                            </Button>
                            </label>

                            <Button
                                variant="contained"
                                color="inherit"
                                className={classes.button}
                                endIcon={<KeyboardArrowRightSharp />}
                                onClick={uploadHandler}

                                style={{ margin: 10 }}
                            >
                                Submit
                            </Button>
                        </CardContent>



                    </Card>

                </Grid>

                {/* QnA */}
                <Grid item >

                    <Card className={classes.cardrootprocessing}>
                        <CardHeader
                            title={'Ask Questions'}
                            subheader={'ask questions from tour documents MLR'}
                        >

                        </CardHeader>
                        <CardContent>
                            {(result) ? paragraphs.map((row) => (
                                <p>
                                    <Highlighter

                                        searchWords={[]}
                                        autoEscape={true}
                                        textToHighlight={row.text}
                                    />

                                </p>
                            )) : 'text to appear here...'}
                        </CardContent>
                        <CardContent>
                            <TextField
                                id="filled-multiline-static"
                                label="Enter your question"
                                multiline
                                rows={2}
                                defaultValue="What is the meaning of this document?"
                                variant="standard"
                                style={{ width: '100%', height: 'auto' }}
                                onChange={handleUserQuestion}
                            />


                        </CardContent>
                        <CardContent>
                            <Button variant="contained" color="primary" onClick={handleQnA}>
                                Get Answer
                            </Button>

                        </CardContent>
                        <CardContent>

                            <List>
                                {(answers.length > 0) ?
                                    answers.map((ans) => (
                                        <>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={ans.text}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                            color="textPrimary"
                                                        >
                                                            {/* {ans.score} */}
                                                        </Typography>

                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                        </>
                                    ))

                                    :
                                    <p>answers to appear here...</p>
                                }
                            </List>
                        </CardContent>



                    </Card>

                </Grid>
                <Grid item>
                    <Card className={classes.cardrootprocessing}>
                        <CardHeader
                            title={'Document'}

                        >
                        </CardHeader>
                        <CardContent>

                            <div ref={canvasContainer}>
                                <canvas ref={canvasRef} height={0} width={0} />
                            </div>
                        </CardContent>
                    </Card>
                </Grid>

                {(result) ?
                    <Grid item >

                        <Card className={classes.cardrootprocessing}>
                            <CardHeader
                                title={'Processing Result'}

                            >
                            </CardHeader>
                            <CardContent className={classes.demo}>
                                <Typography variant="h6" className={classes.title}>  Paragraphs </Typography>
                                <div className={classes.paragraphroot}>
                                    <GridList cellHeight={160} className={classes.gridList} cols={3}>
                                        {paragraphs.map((row) => (
                                            <GridListTile >
                                                <ListItem
                                                    button
                                                    onClick={(event) => handleListItemClick(event, row)}
                                                    style={{ height: 'auto' }}
                                                >
                                                    <ListItemText primary={row.text}
                                                        secondary={row.confidence.toFixed(2) + '%'} />

                                                </ListItem>
                                            </GridListTile>
                                        ))}
                                    </GridList>
                                </div>


                            </CardContent>
                            <CardContent className={classes.demo}>
                                <Typography variant="h6" className={classes.title}>  Lines </Typography>

                                <List component="p" style={{ maxHeight: '100%', overflow: 'auto' }}>
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
                            <Skeleton animation="wave" variant="rect" />
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" variant="rect" />
                            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                            <Skeleton animation="wave" variant="rect" />
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


export default MLRComponent;