import React, { useContext } from 'react';
import { VideoCallContext } from './VideoCallContext';

const VideoCallService = ({ userType }) => {
    const {
        startCSR,
        endCall
    } = useContext(VideoCallContext);

    return (
        <div>
            {userType === 'CSR' && (
                <button id="startCSR" onClick={startCSR}>Join Queue</button>
            )}
            <button id="endCall" onClick={endCall}>End Call</button>
        </div>
    )
};

export default VideoCallService;
