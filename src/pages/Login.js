import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import { loginUser } from '../api/authorizationService';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error_message, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await loginUser({ email, password });
            console.log(response.message);
            localStorage.setItem("access_token", response.access_token);
            window.dispatchEvent(new Event("tokenChanged"));
            navigate("/");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error_message && <p className="error-message">{error_message}</p>}

                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? "Loading.." : "Enter"}
                    </button>
                </form>

                <p className="login-link">
                    Don`t have account? <Link to="/register">Registration</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
