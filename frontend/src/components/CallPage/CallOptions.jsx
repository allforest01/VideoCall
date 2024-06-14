import React, { useState, useContext } from 'react';
import { Button, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Phone, PhoneDisabled, Queue, Logout, Videocam, VideocamOff, Mic, MicOff } from '@mui/icons-material';
import { VideoCallContext } from './VideoCallContext';

const StyledPaper = styled(Paper)({
    padding: '10px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap', // Ensure buttons wrap if they overflow
    justifyContent: 'center',
    alignItems: 'center',
});

const IconButton = styled(Button)({
    minWidth: '40px', // Reduce button width
    padding: '10px', // Adjust padding to ensure consistent size
    '& .MuiButton-startIcon': {
        margin: 0, // Remove margin between icon and text
    }
});

const ControlBar = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
});

const CallOptions = ({ userType, children }) => {
    const {
        localStream,
        callAccepted,
        joinedQueue,
        startCSR,
        callCSR,
        endCall
    } = useContext(VideoCallContext);

    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);

    const toggleVideo = () => {
        setVideoEnabled(!videoEnabled);
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    const toggleAudio = () => {
        setAudioEnabled(!audioEnabled);
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
        }
    };

    return (
        <StyledPaper elevation={10}>
            {localStream && callAccepted && (
                <ControlBar>
                    {videoEnabled ? (
                        <IconButton variant="contained" color="primary"
                            startIcon={<Videocam fontSize="large" />}
                            onClick={toggleVideo} />
                    ) : (
                        <IconButton variant="contained" color="secondary"
                            startIcon={<VideocamOff fontSize="large" />}
                            onClick={toggleVideo} />
                    )}

                    {audioEnabled ? (
                        <IconButton variant="contained" color="primary"
                            startIcon={<Mic fontSize="large" />}
                            onClick={toggleAudio} />
                    ) : (
                        <IconButton variant="contained" color="secondary"
                            startIcon={<MicOff fontSize="large" />}
                            onClick={toggleAudio} />
                    )}

                    <IconButton
                        variant="contained" color="secondary"
                        startIcon={<PhoneDisabled fontSize="large" />}
                        onClick={() => endCall()} />
                </ControlBar>
            )}
            {!callAccepted && (
                userType === 'CSR' ? (
                    !joinedQueue ? (
                        <Button variant="contained" color="primary"
                            startIcon={<Queue fontSize="large" />}
                            onClick={() => startCSR()}>
                            Join Queue
                        </Button>
                    ) : (
                        <Button variant="contained" color="secondary"
                            startIcon={<Logout fontSize="large" />}
                            onClick={() => endCall()}>
                            Leave Queue
                        </Button>
                    )
                ) : (
                    <Button
                        variant="contained" color="primary"
                        startIcon={<Phone fontSize="large" />}
                        onClick={() => callCSR()}>
                        Call CSR
                    </Button>
                )
            )}
            {children}
        </StyledPaper>
    );
};

export default CallOptions;
