import React from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';
import './Navbar.css';

function Navbar() {
    const isAuthenticated = UserService.isAuthenticated();
    const isAdmin = UserService.isAdmin();

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            UserService.logout();
        }
    };

    return (
        <div>
            <nav>
                <ul>
                    {!isAuthenticated && <li><Link to="/">allforest01</Link></li>}
                    {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
                    {isAuthenticated && <li><Link to="/call-center">Call Center</Link></li>}
                    {isAdmin && <li><Link to="/admin/user-management">User Management</Link></li>}
                    {isAuthenticated && <li><Link to="/" onClick={handleLogout}>Logout</Link></li>}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;