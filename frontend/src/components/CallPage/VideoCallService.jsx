import React, { useContext } from 'react';
import { VideoCallContext } from './VideoCallContext';

const VideoCallService = ({ userType }) => {
    const {
        localVideoRef,
        remoteVideoRef,
        startCSR,
        callCSR,
        endCall
    } = useContext(VideoCallContext);

    return (
        <div>
            {/* <style>
                {`
                    .mirrored-video {
                        transform: scaleX(-1);
                    }
                `}
            </style>
            <div>
                <video id="localVideo" ref={localVideoRef} autoPlay muted className="mirrored-video"></video>
                <video id="remoteVideo" ref={remoteVideoRef} autoPlay className="mirrored-video"></video>
            </div> */}
            {userType === 'CSR' ? (
                <button id="startCSR" onClick={startCSR}>Start as CSR</button>
            ) : (
                <div>
                    <button id="callCSR" onClick={callCSR}>Call CSR</button>
                </div>
            )}
            <button id="endCall" onClick={endCall}>End Call</button>
        </div>
    )
};

export default VideoCallService;
