import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import { loginUser } from '../api/authorizationService';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error_message, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Используем useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setErrorMessage(""); // Сбрасываем ошибку перед отправкой

        try {
            const response = await loginUser({ email, password });
            console.log(response.message); // Ответ от сервера
            localStorage.setItem("access_token", response.access_token); // Сохраняем токен
            window.dispatchEvent(new Event("tokenChanged"));
            navigate("/");
        } catch (error) {
            setErrorMessage(error.message); // Показываем ошибку
        } finally {
            setIsLoading(false); // Останавливаем индикатор загрузки
        }
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

                    {error_message && <p className="error-message">{error_message}</p>}

                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? "Загрузка..." : "Войти"}
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
