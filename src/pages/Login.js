import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Логика логина (временно log)
        console.log("Логин с данными:", { email, password });
        if (!email || !password) {
            setErrorMessage("Пожалуйста, заполните все поля.");
            return;
        }

        // Для настоящего логина добавьте реальную проверку
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Вход</h1>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="email">Электронная почта:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <button type="submit" className="submit-button">
                        Войти
                    </button>
                </form>

                <p className="login-link">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
