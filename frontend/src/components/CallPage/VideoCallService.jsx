import React, { useContext } from 'react';
import { VideoCallContext } from './VideoCallContext';

const VideoCallService = ({ userType }) => {
    const {
        startCSR,
        callCSR,
        endCall
    } = useContext(VideoCallContext);

    return (
        <div>
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
