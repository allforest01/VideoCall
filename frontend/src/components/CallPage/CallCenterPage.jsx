import React, { useState, useEffect } from 'react';
import { Typography, AppBar } from '@mui/material';
import { styled } from '@mui/system';
import { StompSessionProvider } from 'react-stomp-hooks';
import { VideoCallProvider } from './VideoCallContext';
import UserService from '../UsersPage/UserService';
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

    useEffect(() => {
        fetchRole();
    }, []);

    const fetchRole = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            console.log(response);
            setUserType(response.users.role);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="call-center-page">
            <StompSessionProvider url={SERVER_STOMP_URL}>
                {userType && (
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
