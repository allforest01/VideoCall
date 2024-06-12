import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/system';
import { StompSessionProvider } from 'react-stomp-hooks';

import { VideoCallProvider } from './VideoCallContext';
import VideoCallService from './VideoCallService';

import VideoPlayer from './VideoPlayer';
import CallNotifications from './CallNotifications';
import CallOptions from './CallOptions';

const SERVER_STOMP_URL = 'http://localhost:8443/websocket';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
    border: "2px solid black",
    [theme.breakpoints.down("xs")]: {
        width: "90%",
    },
}));

const Wrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
});

function CallCenterPage() {
    const [userType, setUserType] = useState(null);

    const startService = (type) => {
        setUserType(type);
    };

    return (
        <div className="call-center-page">
            <h2>Call Center Page</h2>
            <StompSessionProvider url={SERVER_STOMP_URL}>
                {!userType ? (
                    <div>
                        <button onClick={() => startService('CSR')}>Start as Customer Service Representative</button>
                        <button onClick={() => startService('Customer')}>Start as Customer</button>
                    </div>
                ) : (
                    <VideoCallProvider userType={userType}>
                        <VideoCallService userType={userType} />
                        <Wrapper>
                            <StyledAppBar position="static" color="inherit">
                                <Typography variant="h2" align="center">Video Chat</Typography>
                            </StyledAppBar>
                            <VideoPlayer />
                            <CallOptions userType={userType}>
                                <CallNotifications />
                            </CallOptions>
                        </Wrapper>
                    </VideoCallProvider>
                )}
            </StompSessionProvider>
        </div>
    );
}

export default CallCenterPage;
