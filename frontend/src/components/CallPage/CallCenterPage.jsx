import React, { useState } from 'react';
import { Typography, AppBar } from '@mui/material';
import { styled } from '@mui/system';
import { StompSessionProvider } from 'react-stomp-hooks';
import { VideoCallProvider } from './VideoCallContext';
import VideoPlayer from './VideoPlayer';
import CallOptions from './CallOptions';
import CallNotifications from './CallNotifications';

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
            <StompSessionProvider url={SERVER_STOMP_URL}>
                {!userType ? (
                    <div>
                        <button onClick={() => startService('CSR')}>Start as Customer Service Representative</button>
                        <button onClick={() => startService('Customer')}>Start as Customer</button>
                    </div>
                ) : (
                    <VideoCallProvider userType={userType}>
                        <Wrapper>
                            <StyledAppBar position="static" color="inherit">
                                <Typography variant="h2" align="center">Video Chat</Typography>
                            </StyledAppBar>
                            <CallOptions userType={userType}>
                                <CallNotifications />
                            </CallOptions>
                            <VideoPlayer />
                        </Wrapper>
                    </VideoCallProvider>
                )}
            </StompSessionProvider>
        </div>
    );
}

export default CallCenterPage;
