import React, { useState, useEffect } from 'react';
// import { Typography, AppBar, Toolbar } from '@mui/material';
import { styled } from '@mui/system';
import { StompSessionProvider } from 'react-stomp-hooks';
import { VideoCallProvider } from './VideoCallContext';
import UserService from '../UsersPage/UserService';
import VideoPlayer from './VideoPlayer';
import CallOptions from './CallOptions';
import CallNotifications from './CallNotifications';

const SERVER_STOMP_URL = 'http://localhost:8443/websocket';

const Wrapper = styled('div')({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    position: "relative",
    backgroundColor: "#f0f0f0",
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
