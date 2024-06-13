import React, { useContext } from 'react';
import { styled } from '@mui/system';
import { VideoCallContext } from './VideoCallContext';

const VideoWrapper = styled('div')({
    width: '80%',
    height: 'calc(100vh - 100px)',
    position: 'relative',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '5px solid #fff', // Add border for visibility
    borderRadius: '10px',
    overflow: 'hidden',
});

const StyledVideo = styled('video')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const MiniVideoContainer = styled('div')({
    width: '150px',
    height: '100px',
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    borderRadius: '8px',
    overflow: 'hidden',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const MiniVideo = styled('video')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const VideoPlayer = () => {
    const {
        localVideoRef,
        remoteVideoRef,
        localStream,
        callAccepted,
        callEnded
    } = useContext(VideoCallContext);

    return (
        <VideoWrapper>
            {callAccepted && !callEnded && (
                <StyledVideo playsInline ref={remoteVideoRef} autoPlay />
            )}
            {localStream && (
                <MiniVideoContainer>
                    <MiniVideo playsInline muted ref={localVideoRef} autoPlay />
                </MiniVideoContainer>
            )}
        </VideoWrapper>
    );
};

export default VideoPlayer;
