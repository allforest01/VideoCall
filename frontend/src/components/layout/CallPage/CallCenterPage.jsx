import React, { useState } from 'react';
import VideoCallService from '../../service/VideoCallService';

function CallCenterPage() {
    const [userType, setUserType] = useState(null);

    const startService = (type) => {
        setUserType(type);
    };

    return (
        <div className="call-center-page">
            <h2>Call Center Page</h2>
            {!userType ? (
                <div>
                    <button onClick={() => startService('CSR')}>Start as Customer Service Representative</button>
                    <button onClick={() => startService('Customer')}>Start as Customer</button>
                </div>
            ) : (
                <VideoCallService userType={userType} />
            )}
        </div>
    );
}

export default CallCenterPage;
