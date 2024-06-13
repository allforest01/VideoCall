import React, { useContext } from 'react';
// import CryptoJS from 'crypto-js';
import { Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { VideoCallContext } from './VideoCallContext';

const StyledVideo = styled('video')(({ theme }) => ({
    width: '550px',
    [theme.breakpoints.down('xs')]: {
        width: '300px',
    },
}));

const StyledGridContainer = styled(Grid)(({ theme }) => ({
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
    },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
}));

// const decryptEmail = (encryptedEmail, key) => {
//     const bytes = CryptoJS.AES.decrypt(encryptedEmail, key);
//     return bytes.toString(CryptoJS.enc.Utf8);
// };

const VideoPlayer = () => {
    const {
        localVideoRef,
        remoteVideoRef,
        localStream,
        callAccepted,
        callEnded,
        // localID,
        // remoteID
    } = useContext(VideoCallContext);

    // const decodedLocalID = decryptEmail(localID, "S3CR3T");
    // const decodedRemoteID = decryptEmail(remoteID, "S3CR3T");

    return (
        <StyledGridContainer container>
            {localStream && (
                <StyledPaper>
                    <Grid item xs={12} md={6}>
                        {/* <Typography variant="h5" gutterBottom>{decodedLocalID}</Typography> */}
                        <StyledVideo playsInline muted ref={localVideoRef} autoPlay />
                    </Grid>
                </StyledPaper>
            )}
            {callAccepted && !callEnded && (
                <StyledPaper>
                    <Grid item xs={12} md={6}>
                        {/* <Typography variant="h5" gutterBottom>{decodedRemoteID}</Typography> */}
                        <StyledVideo playsInline ref={remoteVideoRef} autoPlay />
                    </Grid>
                </StyledPaper>
            )}
        </StyledGridContainer>
    );
};

export default VideoPlayer;
