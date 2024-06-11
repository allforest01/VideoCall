import React, { useEffect, useRef, useState } from 'react';
import { StompSessionProvider, useStompClient, useSubscription } from 'react-stomp-hooks';
import UserService from '../service/UserService';

const SERVER_STOMP_URL = 'http://localhost:8443/websocket';

const hashEmailToID = async (email) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

const VideoChat = () => {
    const client = useStompClient();
    const [localStream, setLocalStream] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [localID, setLocalID] = useState('');
    const [remoteID, setRemoteID] = useState('');
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    useEffect(() => {
        const getHashedEmail = async () => {
            const hashedEmail = await hashEmailToID(profileInfo.email);
            setLocalID(hashedEmail);
            console.log('Local ID:', hashedEmail);
        };

        getHashedEmail();
    }, [profileInfo]);

    const handleRemoteIDChange = async (e) => {
        const email = e.target.value;
        const hashedEmail = await hashEmailToID(email);
        setRemoteID(hashedEmail);
        console.log('Remote ID:', hashedEmail)
    };

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            console.log(response);
            setProfileInfo(response.users);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    useEffect(() => {
        const iceServers = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };

        const peer = new RTCPeerConnection(iceServers);
        setLocalPeer(peer);

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useSubscription(`/user/${localID}/topic/call`, (message) => {
        const callerID = message.body;
        setRemoteID(callerID);
        handleIncomingCall(callerID);
    });

    useSubscription(`/user/${localID}/topic/offer`, (message) => {
        const offer = JSON.parse(message.body).offer;
        handleOffer(offer);
    });

    useSubscription(`/user/${localID}/topic/answer`, (message) => {
        const answer = JSON.parse(message.body).answer;
        handleAnswer(answer);
    });

    useSubscription(`/user/${localID}/topic/candidate`, (message) => {
        const candidate = JSON.parse(message.body).candidate;
        handleCandidate(candidate);
    });

    const handleIncomingCall = (callerID) => {
        localPeer.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        localPeer.onicecandidate = event => {
            if (event.candidate) {
                const candidate = {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.candidate
                };
                client.publish({
                    destination: "/app/candidate",
                    body: JSON.stringify({
                        toUser: callerID,
                        fromUser: localID,
                        candidate
                    })
                });
            }
        };

        localStream.getTracks().forEach(track => {
            localPeer.addTrack(track, localStream);
        });

        localPeer.createOffer().then(description => {
            localPeer.setLocalDescription(description);
            client.publish({
                destination: "/app/offer",
                body: JSON.stringify({
                    toUser: callerID,
                    fromUser: localID,
                    offer: description
                })
            });
        });
    };

    const handleOffer = (offer) => {
        localPeer.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        localPeer.onicecandidate = event => {
            if (event.candidate) {
                const candidate = {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.candidate
                };
                client.publish({
                    destination: "/app/candidate",
                    body: JSON.stringify({
                        toUser: remoteID,
                        fromUser: localID,
                        candidate
                    })
                });
            }
        };

        localStream.getTracks().forEach(track => {
            localPeer.addTrack(track, localStream);
        });

        localPeer.setRemoteDescription(new RTCSessionDescription(offer));
        localPeer.createAnswer().then(description => {
            localPeer.setLocalDescription(description);
            client.publish({
                destination: "/app/answer",
                body: JSON.stringify({
                    toUser: remoteID,
                    fromUser: localID,
                    answer: description
                })
            });
        });
    };

    const handleAnswer = (answer) => {
        localPeer.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleCandidate = (candidate) => {
        const iceCandidate = new RTCIceCandidate({
            sdpMLineIndex: candidate.label,
            candidate: candidate.id
        });
        localPeer.addIceCandidate(iceCandidate);
    };

    const call = () => {
        client.publish({
            destination: "/app/call",
            body: JSON.stringify({
                callTo: remoteID,
                callFrom: localID
            })
        });
    };

    const testConnection = () => {
        client.publish({
            destination: "/app/testServer",
            body: "Test Server"
        });
    };

    return (
        <div>
            <style>
                {`
                    .mirrored-video {
                        transform: scaleX(-1);
                    }
                `}
            </style>
            <div>
                <video id="localVideo" ref={localVideoRef} autoPlay muted className="mirrored-video"></video>
                <video id="remoteVideo" ref={remoteVideoRef} autoPlay className="mirrored-video"></video>
            </div>
            <input
                id="remoteId"
                type="text"
                placeholder="Enter Remote ID"
                onChange={e => handleRemoteIDChange(e)}
            />
            <button id="callBtn" onClick={call}>Call</button>
            <button id="testConnection" onClick={testConnection}>Test Connection</button>
        </div>
    );
};

const VideoCall = () => (
    <StompSessionProvider url={SERVER_STOMP_URL}>
        <VideoChat />
    </StompSessionProvider>
);

export default VideoCall;