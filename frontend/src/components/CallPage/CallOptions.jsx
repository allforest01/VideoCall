import React, { useContext } from 'react';
import { Button, Container, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Phone, Queue, PhoneDisabled, PersonalVideo, KeyboardVoice } from '@mui/icons-material';
import { VideoCallContext } from './VideoCallContext';

const StyledContainer = styled(Container)(({ theme }) => ({
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}));

const CallOptions = ({ userType, children }) => {
    const {
        localStream,
        callAccepted,
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
            <Paper elevation={10} style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                {localStream && callAccepted && (
                    <>
                        <Button variant="contained" color="primary"
                        startIcon={<PersonalVideo fontSize="large" />} fullWidth
                        onClick={toggleVideo}>
                        Toggle</Button>

                        <Button variant="contained" color="primary"
                        startIcon={<KeyboardVoice fontSize="large" />} fullWidth
                        onClick={toggleAudio}>
                        Toggle</Button>
                    </>
                )}
                {callAccepted ? (
                    <Button
                        variant="contained" color="secondary"
                        startIcon={<PhoneDisabled fontSize="large" />} fullWidth
                        onClick={() => endCall()}>
                        Leave
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
                {children}
            </Paper>
        </StyledContainer>
    );
};

export default CallOptions;
