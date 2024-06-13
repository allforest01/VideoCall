import React, { useContext, useCallback } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { VideoCallContext } from './VideoCallContext';
import { PhoneInTalk, CallEnd } from '@mui/icons-material';

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
        callAccepted
    } = useContext(VideoCallContext);

    const memoizedHandleIncomingCall = useCallback(() => {
        handleIncomingCall();
    }, [handleIncomingCall]);

    const memoizedRejectCall = useCallback(() => {
        rejectCall();
    }, [rejectCall]);

    return (
        <StyledDialog
            open={callReceived && !callAccepted}
            onClose={memoizedRejectCall}>
            <DialogTitle disableTypography>
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
    );
}

export default CallNotifications;
