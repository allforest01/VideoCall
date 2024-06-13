import React, { useContext, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { VideoCallContext } from './VideoCallContext';

const CallNotifications = () => {
    const {
        handleIncomingCall,
        rejectCall,
        callReceived,
        callAccepted
    } = useContext(VideoCallContext);

    // Memoize the handleIncomingCall to prevent unnecessary re-renders
    const memoizedHandleIncomingCall = useCallback(() => {
        handleIncomingCall();
    }, [handleIncomingCall]);

    // Memoize the memoizedRejectCall to prevent unnecessary re-renders
    const memoizedRejectCall = useCallback(() => {
        rejectCall();
    }, [rejectCall]);

    return (
        <div>
            {callReceived && !callAccepted && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <Typography gutterBottom variant="h6" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Incoming Call</Typography>
                    <Button variant="contained" color="primary" onClick={memoizedHandleIncomingCall}>Accept</Button>
                    <Button variant="contained" color="primary" onClick={memoizedRejectCall}>Reject</Button>
                </div>
            )}
        </div>
    );
}

export default CallNotifications;
