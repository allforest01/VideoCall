import React, { createContext, useState, useRef, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { useStompClient, useSubscription } from 'react-stomp-hooks';
import UserService from '../UsersPage/UserService';

const VideoCallContext = createContext();

const VideoCallProvider = ({ userType, children }) => {
    const client = useStompClient();
    const [callReceived, setCallReceived] = useState(false);
    const [callAccepted, setCallAccepted] = useState(false);
    const [joinedQueue, setJoinedQueue] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [localPeer, setLocalPeer] = useState(null);
    const [localID, setLocalID] = useState('');
    const [remoteID, setRemoteID] = useState('');
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const [profileInfo, setProfileInfo] = useState({});
    const [iceCandidateQueue, setIceCandidateQueue] = useState([]);

    const encryptEmail = (email) => {
        const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        const combinedEmail = email + salt;
        const hash = CryptoJS.SHA256(combinedEmail).toString(CryptoJS.enc.Hex);
        return hash.substring(0, 16);
    };

    useEffect(() => {
        const getEncryptedEmail = async () => {
            const encryptedEmail = await encryptEmail(profileInfo.email);
            setLocalID(encryptedEmail);
            console.log('Local ID:', encryptedEmail);
        };

        if (profileInfo.email) {
            getEncryptedEmail();
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
        fetchProfileInfo();
    }, []);

    const initVideoCall = async () => {
        const iceServers = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                }
            ]
        };
    
        const peer = new RTCPeerConnection(iceServers);
        setLocalPeer(peer);
    
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            const waitForLocalVideoRefCurrent = () => {
                return new Promise((resolve) => {
                    const checkAvailable = () => {
                        if (localVideoRef.current) {
                            resolve();
                        } else {
                            setTimeout(checkAvailable, 100);
                        }
                    };
                    checkAvailable();
                });
            };
        
            await waitForLocalVideoRefCurrent();
            localVideoRef.current.srcObject = stream;
            console.log('Local stream obtained');

        } catch (error) {
            console.error('Error obtaining local stream:', error);
        }
    };

    useSubscription(`/user/${localID}/topic/call`, (message) => {
        const callerID = message.body;
        setRemoteID(callerID);
        setCallReceived(true);
        console.log('Call received from:', callerID);
    });

    useSubscription(`/user/${localID}/topic/noCSRAvailable`, (message) => {
        handleNoCSRAvailable();
    });

    useSubscription(`/user/${localID}/topic/callRejected`, (message) => {
        const rejectingUser = message.body;
        handleCallRejected(rejectingUser);
    });

    useSubscription(`/user/${localID}/topic/connectedCSR`, (message) => {
        const csrID = message.body;
        console.log('Connected to CSR:', csrID);
        handleConnectedCSR();
    });

    useSubscription(`/user/${localID}/topic/offer`, (message) => {
        const { offer, fromUser } = JSON.parse(message.body);
        setRemoteID(fromUser);
        handleOffer(offer, fromUser);
    });

    useSubscription(`/user/${localID}/topic/answer`, (message) => {
        const { answer, fromUser } = JSON.parse(message.body);
        setRemoteID(fromUser);
        handleAnswer(answer);
    });

    useSubscription(`/user/${localID}/topic/candidate`, (message) => {
        const { candidate, fromUser } = JSON.parse(message.body);
        setRemoteID(fromUser);
        handleCandidate(candidate);
    });

    useSubscription(`/user/${localID}/topic/endCall`, () => {
        handleEndCall();
    });

    const handleIncomingCall = async () => {

        const waitForRemoteID = () => {
            return new Promise((resolve) => {
                const checkAvailable = () => {
                    if (remoteID) {
                        resolve();
                    } else {
                        setTimeout(checkAvailable, 100);
                    }
                };
                checkAvailable();
            });
        };
    
        await waitForRemoteID();

        setCallReceived(false);
        setCallAccepted(true);

        console.log('Handling incoming call from:', remoteID);
        localPeer.ontrack = event => {
            console.log('[handleIncomingCall] remoteVideoRef')
            console.log(remoteVideoRef)
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
                console.log('Sending ICE candidate', { toUser: remoteID, fromUser: localID, candidate });
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

        if (localStream)
        {
            console.log('[handleIncomingCall] Adding local stream to peer connection');
            localStream.getTracks().forEach(track => {
                localPeer.addTrack(track, localStream);
            });
        }

        localPeer.createOffer().then(description => {
            localPeer.setLocalDescription(description);
            console.log('Sending offer', { toUser: remoteID, fromUser: localID, offer: description });
            client.publish({
                destination: "/app/offer",
                body: JSON.stringify({
                    toUser: remoteID,
                    fromUser: localID,
                    offer: description
                })
            });
        });
    };

    const handleNoCSRAvailable = () => {
        alert("No CSR available at the moment. Please try again later.");
        console.log("No CSR available at the moment. Please try again later.");
        handleEndCall();
    };

    const handleCallRejected = (rejectingUser) => {
        alert(`Call was rejected!`);
        handleEndCall();
    };

    const handleConnectedCSR = () => {
        initVideoCall();
    }

    const handleOffer = async (offer, callerID) => {
        setCallAccepted(true);

        console.log('Handling offer:', offer);
    
        const waitForLocalStream = () => {
            return new Promise((resolve) => {
                const checkStream = () => {
                    if (localStream) {
                        resolve();
                    } else {
                        setTimeout(checkStream, 100);
                    }
                };
                checkStream();
            });
        };
    
        await waitForLocalStream();
    
        localPeer.ontrack = event => {
            console.log('[handleOffer] remoteVideoRef')
            console.log(remoteVideoRef)
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
    
        console.log('[handleOffer] Adding local stream to peer connection');
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

    const handleEndCall = () => {

        setCallReceived(false);
        setCallAccepted(false);
        setJoinedQueue(false);

        console.log('Ending call');
        if (localPeer) {
            localPeer.close();
            setLocalPeer(null);
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
            localVideoRef.current = null;
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
            remoteVideoRef.current = null;
        }

        setRemoteID('');
    };

    const endCall = () => {
        client.publish({
            destination: "/app/endCall",
            body: JSON.stringify({
                toUser: remoteID,
                fromUser: localID
            })
        });
        handleEndCall();
    };

    const startCSR = async () => {
        await initVideoCall();
        console.log('Starting as CSR');
        client.publish({
            destination: "/app/registerCSR",
            body: JSON.stringify({
                csrID: localID
            })
        });
        setJoinedQueue(true);
    };

    const callCSR = async () => {
        console.log('Calling CSR');
        client.publish({
            destination: "/app/callCSR",
            body: JSON.stringify({
                callFrom: localID
            })
        });
    };

    const rejectCall = () => {
        client.publish({
            destination: "/app/rejectCall",
            body: JSON.stringify({
                fromUser: localID,
                toUser: remoteID
            })
        });
        handleEndCall();
    };

    return (
        <VideoCallContext.Provider value={{
            localVideoRef,
            remoteVideoRef,
            localStream,
            callReceived,
            callAccepted,
            joinedQueue,
            localID,
            remoteID,
            startCSR,
            callCSR,
            endCall,
            rejectCall,
            handleIncomingCall
        }}>
            {children}
        </VideoCallContext.Provider>
    );
}

export { VideoCallProvider, VideoCallContext };