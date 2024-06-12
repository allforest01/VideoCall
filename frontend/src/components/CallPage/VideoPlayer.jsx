import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import { VideoCallContext } from './VideoCallContext';

const StyledVideo = styled('video')(({ theme }) => ({
    width: '550px',
    [theme.breakpoints.down('xs')]: {
        width: '300px',
    },
}));

const StyledGridContainer = styled(Grid)(({ theme }) => ({
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
}));

const VideoPlayer = () => {
    const {
        localVideoRef,
        remoteVideoRef,
        localStream,
        callAccepted,
        callEnded,
    } = useContext(VideoCallContext);

    return (
        <StyledGridContainer container>
            {localStream && (
                <StyledPaper>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>Name</Typography>
                        <StyledVideo playsInline muted ref={localVideoRef} autoPlay />
                    </Grid>
                </StyledPaper>
            )}
            {callAccepted && !callEnded && (
                <StyledPaper>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>Name</Typography>
                        <StyledVideo playsInline ref={remoteVideoRef} autoPlay />
                    </Grid>
                </StyledPaper>
            )}
        </StyledGridContainer>
    );
};

export default VideoPlayer;
