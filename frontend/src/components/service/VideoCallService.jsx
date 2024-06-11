import React, { useEffect, useRef, useState } from 'react';
import { StompSessionProvider, useStompClient, useSubscription } from 'react-stomp-hooks';
import UserService from './UserService';

const SERVER_STOMP_URL = 'http://localhost:8443/websocket';

const hashEmailToID = async (email) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

const VideoChat = ({ userType }) => {
    const client = useStompClient();
    const [localStream, setLocalStream] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [localID, setLocalID] = useState('');
    // const [remoteID, setRemoteID] = useState('');
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [profileInfo, setProfileInfo] = useState({});
    const [iceCandidateQueue, setIceCandidateQueue] = useState([]);

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    useEffect(() => {
        const getHashedEmail = async () => {
            const hashedEmail = await hashEmailToID(profileInfo.email);
            setLocalID(hashedEmail);
            console.log('Local ID:', hashedEmail);
        };

        if (profileInfo.email) {
            getHashedEmail();
        }
    }, [profileInfo]);

    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            console.log('Fetching profile info with token:', token);
            const response = await UserService.getYourProfile(token);
            console.log('Profile info:', response);
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
                console.log('Local stream obtained');
            })
            .catch(error => {
                console.error('Error obtaining local stream:', error);
            });
    }, []);

    useSubscription(`/user/${localID}/topic/call`, (message) => {
        const callerID = message.body;
        // setRemoteID(callerID);
        handleIncomingCall(callerID);
    });

    useSubscription(`/user/${localID}/topic/offer`, (message) => {
        const { offer, fromUser } = JSON.parse(message.body);
        // setRemoteID(fromUser);
        handleOffer(offer, fromUser);
    });

    useSubscription(`/user/${localID}/topic/answer`, (message) => {
        const { answer, fromUser } = JSON.parse(message.body);
        // setRemoteID(fromUser);
        handleAnswer(answer);
    });

    useSubscription(`/user/${localID}/topic/candidate`, (message) => {
        const { candidate, fromUser } = JSON.parse(message.body);
        // setRemoteID(fromUser);
        handleCandidate(candidate);
    });

    const handleIncomingCall = (callerID) => {
        console.log('Handling incoming call from:', callerID);
        localPeer.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
            console.log('Remote track received');
        };

        localPeer.onicecandidate = event => {
            if (event.candidate) {
                const candidate = {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.candidate
                };
                console.log('Sending ICE candidate', { toUser: callerID, fromUser: localID, candidate });
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
            console.log('Sending offer', { toUser: callerID, fromUser: localID, offer: description });
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

    const handleOffer = async (offer, callerID) => {
        console.log('Handling offer:', offer);
        localPeer.ontrack = event => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
            console.log('Remote track received');
        };

        localPeer.onicecandidate = event => {
            if (event.candidate) {
                const candidate = {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.candidate
                };
                console.log('Sending ICE candidate', { toUser: callerID, fromUser: localID, candidate });
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

        try {
            await localPeer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await localPeer.createAnswer();
            await localPeer.setLocalDescription(answer);
            console.log('Sending answer', { toUser: callerID, fromUser: localID, answer });
            client.publish({
                destination: "/app/answer",
                body: JSON.stringify({
                    toUser: callerID,
                    fromUser: localID,
                    answer
                })
            });

            // Add queued ICE candidates after setting remote description
            iceCandidateQueue.forEach(candidate => {
                localPeer.addIceCandidate(candidate);
            });
            setIceCandidateQueue([]);

        } catch (error) {
            console.error('Error handling offer:', error);
        }
    };

    const handleAnswer = async (answer) => {
        console.log('Handling answer:', answer);
        try {
            await localPeer.setRemoteDescription(new RTCSessionDescription(answer));

            // Add queued ICE candidates after setting remote description
            iceCandidateQueue.forEach(candidate => {
                localPeer.addIceCandidate(candidate);
            });
            setIceCandidateQueue([]);

        } catch (error) {
            console.error('Error setting remote description for answer:', error);
        }
    };

    const handleCandidate = (candidate) => {
        console.log('Handling candidate:', candidate);
        try {
            const iceCandidate = new RTCIceCandidate({
                sdpMLineIndex: candidate.label,
                candidate: candidate.id
            });
            if (localPeer.remoteDescription && localPeer.remoteDescription.type) {
                localPeer.addIceCandidate(iceCandidate);
                console.log('Adding ICE candidate:', iceCandidate);
            } else {
                console.log('Queueing ICE candidate:', iceCandidate);
                setIceCandidateQueue(prev => [...prev, iceCandidate]);
            }
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    };

    const startCSR = () => {
        console.log('Starting as CSR');
        client.publish({
            destination: "/app/registerCSR",
            body: JSON.stringify({
                csrID: localID
            })
        });
    };

    const callCSR = () => {
        console.log('Calling CSR');
        client.publish({
            destination: "/app/callCSR",
            body: JSON.stringify({
                callFrom: localID
            })
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
            {userType === 'CSR' ? (
                <button id="startCSR" onClick={startCSR}>Start as CSR</button>
            ) : (
                <div>
                    <button id="callCSR" onClick={callCSR}>Call CSR</button>
                </div>
            )}
        </div>
    );
};

const VideoCallService = ({ userType }) => (
    <StompSessionProvider url={SERVER_STOMP_URL}>
        <VideoChat userType={userType} />
    </StompSessionProvider>
);

export default VideoCallService;
