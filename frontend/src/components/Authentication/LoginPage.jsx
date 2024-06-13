import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../UsersPage/UserService";
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await UserService.login(email, password);
            if (userData.token) {
                localStorage.setItem("token", userData.token);
                localStorage.setItem("role", userData.role);
                navigate("/profile");
            } else {
                setError(userData.error);
            }
        } catch (error) {
            console.log(error);
            setError(error.message);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }

    return (
        <div className="login-page">
            <h1>Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginPage;
