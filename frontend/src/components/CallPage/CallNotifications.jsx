import React, { useContext, useCallback } from 'react';
import { Button, Typography } from '@mui/material';
import { VideoCallContext } from './VideoCallContext';

const CallNotifications = () => {
    const {
        handleIncomingCall,
        callReceived,
        callAccepted
    } = useContext(VideoCallContext);

    // Memoize the handleIncomingCall to prevent unnecessary re-renders
    const memoizedHandleIncomingCall = useCallback(() => {
        handleIncomingCall();
    }, [handleIncomingCall]);

    return (
        <div>
            {callReceived && !callAccepted && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                    <Typography gutterBottom variant="h6" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>Incoming Call</Typography>
                    <Button variant="contained" color="primary" onClick={memoizedHandleIncomingCall}>Accept</Button>
                </div>
            )}
        </div>
    );
}

export default CallNotifications;
