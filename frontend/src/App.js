// import React, { useEffect, useRef, useState } from 'react';
// import { StompSessionProvider, useStompClient, useSubscription } from 'react-stomp-hooks';

// const SERVER_STOMP_URL = 'https://localhost:8443/websocket';

// const VideoChat = () => {
//   const client = useStompClient();
//   const [localStream, setLocalStream] = useState(null);
//   const [localPeer, setLocalPeer] = useState(null);
//   const [localID, setLocalID] = useState('');
//   const [remoteID, setRemoteID] = useState('');
//   const localVideoRef = useRef();
//   const remoteVideoRef = useRef();

//   useEffect(() => {
//     const iceServers = {
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com:19302"
//         }
//       ]
//     };

//     const peer = new RTCPeerConnection(iceServers);
//     setLocalPeer(peer);

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         setLocalStream(stream);
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   useSubscription(`/user/${localID}/topic/call`, (message) => {
//     const callerID = message.body;
//     setRemoteID(callerID);
//     handleIncomingCall(callerID);
//   });

//   useSubscription(`/user/${localID}/topic/offer`, (message) => {
//     const offer = JSON.parse(message.body).offer;
//     handleOffer(offer);
//   });

//   useSubscription(`/user/${localID}/topic/answer`, (message) => {
//     const answer = JSON.parse(message.body).answer;
//     handleAnswer(answer);
//   });

//   useSubscription(`/user/${localID}/topic/candidate`, (message) => {
//     const candidate = JSON.parse(message.body).candidate;
//     handleCandidate(candidate);
//   });

//   const handleIncomingCall = (callerID) => {
//     localPeer.ontrack = event => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     localPeer.onicecandidate = event => {
//       if (event.candidate) {
//         const candidate = {
//           type: "candidate",
//           label: event.candidate.sdpMLineIndex,
//           id: event.candidate.candidate
//         };
//         client.publish({
//           destination: "/app/candidate",
//           body: JSON.stringify({
//             toUser: callerID,
//             fromUser: localID,
//             candidate
//           })
//         });
//       }
//     };

//     localStream.getTracks().forEach(track => {
//       localPeer.addTrack(track, localStream);
//     });

//     localPeer.createOffer().then(description => {
//       localPeer.setLocalDescription(description);
//       client.publish({
//         destination: "/app/offer",
//         body: JSON.stringify({
//           toUser: callerID,
//           fromUser: localID,
//           offer: description
//         })
//       });
//     });
//   };

//   const handleOffer = (offer) => {
//     localPeer.ontrack = event => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     localPeer.onicecandidate = event => {
//       if (event.candidate) {
//         const candidate = {
//           type: "candidate",
//           label: event.candidate.sdpMLineIndex,
//           id: event.candidate.candidate
//         };
//         client.publish({
//           destination: "/app/candidate",
//           body: JSON.stringify({
//             toUser: remoteID,
//             fromUser: localID,
//             candidate
//           })
//         });
//       }
//     };

//     localStream.getTracks().forEach(track => {
//       localPeer.addTrack(track, localStream);
//     });

//     localPeer.setRemoteDescription(new RTCSessionDescription(offer));
//     localPeer.createAnswer().then(description => {
//       localPeer.setLocalDescription(description);
//       client.publish({
//         destination: "/app/answer",
//         body: JSON.stringify({
//           toUser: remoteID,
//           fromUser: localID,
//           answer: description
//         })
//       });
//     });
//   };

//   const handleAnswer = (answer) => {
//     localPeer.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleCandidate = (candidate) => {
//     const iceCandidate = new RTCIceCandidate({
//       sdpMLineIndex: candidate.label,
//       candidate: candidate.id
//     });
//     localPeer.addIceCandidate(iceCandidate);
//   };

//   const call = () => {
//     client.publish({
//       destination: "/app/call",
//       body: JSON.stringify({
//         callTo: remoteID,
//         callFrom: localID
//       })
//     });
//   };

//   const testConnection = () => {
//     client.publish({
//       destination: "/app/testServer",
//       body: "Test Server"
//     });
//   };

//   return (
//     <div>
//       <div>
//         <video id="localVideo" ref={localVideoRef} autoPlay muted></video>
//         <video id="remoteVideo" ref={remoteVideoRef} autoPlay></video>
//       </div>
//       <input
//         id="localId"
//         type="text"
//         placeholder="Enter Local ID"
//         onChange={e => setLocalID(e.target.value)}
//       />
//       <button id="connectBtn" onClick={() => {}}>Connect</button>
//       <input
//         id="remoteId"
//         type="text"
//         placeholder="Enter Remote ID"
//         onChange={e => setRemoteID(e.target.value)}
//       />
//       <button id="callBtn" onClick={call}>Call</button>
//       <button id="testConnection" onClick={testConnection}>Test Connection</button>
//     </div>
//   );
// };

// const App = () => (
//   <StompSessionProvider url={SERVER_STOMP_URL}>
//     <VideoChat />
//   </StompSessionProvider>
// );

// export default App;

// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Check if user is authenticated and admin before rendering admin-only routes */}
            {UserService.adminOnly() && (
              <>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/login" />} />‰
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
