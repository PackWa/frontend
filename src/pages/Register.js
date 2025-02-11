import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../App.css';
import { registerUser } from '../api/authorizationService';

const Register = () => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [error_message, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Статус загрузки
    const navigate = useNavigate(); // Используем useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirm_password) {
            setErrorMessage("Пароли не совпадают");
            return;
        }

        setIsLoading(true);
        setErrorMessage(""); // Сбрасываем ошибку перед отправкой

        try {
            const response = await registerUser({ first_name, last_name, phone, email, password });
            console.log(response.message); // Ответ от сервера
            navigate("/login"); // Перенаправляем на страницу логина
        } catch (error) {
            setErrorMessage(error.message); // Показываем ошибку
        } finally {
            setIsLoading(false); // Останавливаем индикатор загрузки
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="first_name">Имя:</label>
                        <input
                            type="text"
                            id="first_name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Фамилия:</label>
                        <input
                            type="text"
                            id="last_name"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

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

                    <div className="form-group">
                        <label htmlFor="confirm_password">Подтвердите пароль:</label>
                        <input
                            type="password"
                            id="confirm_password"
                            value={confirm_password}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error_message && <p className="error-message">{error_message}</p>}

                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? "Загрузка..." : "Зарегистрироваться"}
                    </button>
                </form>

                <p className="login-link">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
