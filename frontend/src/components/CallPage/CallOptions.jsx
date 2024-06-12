import React, { useContext } from 'react';
import { Button, Grid, Container, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Phone, Queue, PhoneDisabled } from '@mui/icons-material';
import { VideoCallContext } from './VideoCallContext';

const StyledForm = styled("form")({
    display: "flex",
    flexDirection: "column",
});

const StyledGridContainer = styled(Grid)(({ theme }) => ({
    width: "100%",
    [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
    },
}));

const StyledContainer = styled(Container)(({ theme }) => ({
    width: "600px",
    margin: "35px 0",
    padding: 0,
    [theme.breakpoints.down("xs")]: {
        width: "80%",
    },
}));

const StyledPadding = styled("div")({
    padding: 20,
});

const StyledPaper = styled(Paper)({
    padding: "10px 20px",
    border: "2px solid black",
});

const CallOptions = ({ userType, children }) => {
    const {
        localStream,
        callAccepted,
        callEnded,
        startCSR,
        callCSR,
        endCall
    } = useContext(VideoCallContext);

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        }
    };
    
    const toggleAudio = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    return (
        <StyledContainer>
            <StyledPaper elevation={10}>
                <StyledForm noValidate autoComplete="off">
                    <StyledGridContainer container>
                        <Grid item xs={12} md={6}>
                            <StyledPadding>
                                {localStream && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Button variant="contained" color="primary" onClick={toggleVideo}>Toggle Video</Button>
                                        <Button variant="contained" color="primary" onClick={toggleAudio}>Toggle Audio</Button>
                                    </div>
                                )}
                            </StyledPadding>
                            <StyledPadding>
                                {callAccepted && !callEnded ? (
                                    <Button
                                        variant="contained" color="secondary"
                                        startIcon={<PhoneDisabled fontSize="large" />} fullWidth
                                        onClick={() => endCall()}>
                                        Hang Up
                                    </Button>
                                ) : (
                                    userType === 'CSR' ? (
                                        <Button variant="contained" color="primary"
                                            startIcon={<Queue fontSize="large" />} fullWidth
                                            onClick={() => startCSR()}>
                                            Join Queue
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained" color="primary"
                                            startIcon={<Phone fontSize="large" />} fullWidth
                                            onClick={() => callCSR()}>
                                            Call CSR
                                        </Button>
                                    )
                                )}
                            </StyledPadding>
                            <StyledPadding>
                                {children}
                            </StyledPadding>
                        </Grid>
                    </StyledGridContainer>
                </StyledForm>
            </StyledPaper>
        </StyledContainer>
    );
};

export default CallOptions;
