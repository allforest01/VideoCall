import React, { useContext, useCallback } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { VideoCallContext } from './VideoCallContext';
import { PhoneInTalk, CallEnd, Cancel } from '@mui/icons-material'; // Import Cancel icon

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
    },
}));

const TitleText = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '10px',
});

const CallNotifications = () => {
    const {
        handleIncomingCall,
        rejectCall,
        callReceived,
        callAccepted,
        calling,
    } = useContext(VideoCallContext);

    const memoizedHandleIncomingCall = useCallback(() => {
        handleIncomingCall();
    }, [handleIncomingCall]);

    const memoizedRejectCall = useCallback(() => {
        rejectCall();
    }, [rejectCall]);

    const cancelCall = () => {
        rejectCall();
    };

    return (
        <>
            <StyledDialog
                open={callReceived && !callAccepted}
                onClose={memoizedRejectCall}>
                <DialogTitle>
                    <TitleText>Incoming Call</TitleText>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={memoizedHandleIncomingCall} color="primary" variant="contained" startIcon={<PhoneInTalk />}>
                        Accept
                    </Button>
                    <Button onClick={memoizedRejectCall} color="secondary" variant="contained" startIcon={<CallEnd />}>
                        Reject
                    </Button>
                </DialogActions>
            </StyledDialog>

            <StyledDialog
                open={calling && !callAccepted}
                onClose={cancelCall}>
                <DialogTitle>
                    <TitleText>Calling CSR...</TitleText>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={cancelCall} color="secondary" variant="contained" startIcon={<Cancel />}>
                        Cancel Call
                    </Button>
                </DialogActions>
            </StyledDialog>
        </>
    );
}

export default CallNotifications;
