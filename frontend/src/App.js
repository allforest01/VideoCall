import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Common/Navbar';
import LoginPage from './components/Authentication/LoginPage';
import RegistrationPage from './components/Authentication/RegistrationPage';
// import FooterComponent from './components/Common/Footer';
import UserService from './components/UsersPage/UserService';
import UpdateUser from './components/UsersPage/UpdateUser';
import ProfilePage from './components/UsersPage/ProfilePage';
import UserManagementPage from './components/UsersPage/UserManagementPage';
import CallCenterPage from './components/CallPage/CallCenterPage';

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
                        <Route path="/call-center" element={<CallCenterPage />} />

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
                {/* <FooterComponent /> */}
            </div>
        </BrowserRouter>
    );
}

export default App;
