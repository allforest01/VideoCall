import React, { useContext, useEffect } from 'react'
import { Grid, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { VideoCallContext } from './VideoCallContext';

const useStyles = makeStyles((theme) => ({
    video: {
        width: "550px",
        [theme.breakpoints.down("xs")]: {
            width: "300px",
        },
    },
    gridContainer: {
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
        },
    },
    paper: {
        padding: "10px",
        border: "2px solid black",
        margin: "10px",
    },
}));

const VideoPlayer = () => {
    const {
        localVideoRef,
        remoteVideoRef,
        localStream,
        callAccepted,
        callEnded,
    } = useContext(VideoCallContext);

    const classes = useStyles();

    return (
        <Grid container className={classes.gridContainer}>
            {localStream && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>Name</Typography>
                        <video playsInline muted ref={localVideoRef} autoPlay className={classes.video} />
                    </Grid>
                </Paper>
            )}
            {callAccepted && !callEnded && (
                <Paper className={classes.paper}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>Name</Typography>
                        <video playsInline muted ref={remoteVideoRef} autoPlay className={classes.video} />
                    </Grid>
                </Paper>
            )}
        </Grid>
    )
}

export default VideoPlayer;